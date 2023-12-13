import db from "$src/lib/server/db";
import { and, asc, desc, eq, inArray, isNull, or, sql } from "drizzle-orm";
import { dbQueryOmit } from "./dbHelpers";
import { category } from "$src/db/schema/category";
import { exercise } from "$src/db/schema/exercise";
import type { Database } from "./dbTypes";
import { supersetExercise } from "$src/db/schema/supersetExercise";
import { superset } from "$src/db/schema/superset";
import { workout } from "$src/db/schema/workout";
import { setWeight } from "$src/db/schema/setWeight";
import { status } from "$src/db/schema/status";
import { unit } from "$src/db/schema/unit";
import type { PageCategory, PageExercisesData, PageSupersetExerciseInfo } from "$src/routes/exercises/types";

export const dbCategoriesExercisesPromise = (userId: string, database: Database = db) => {
	// nejak sikovne rozdelit
	const usersSupersetIds = database
		.select({ supersetId: superset.id })
		.from(superset)
		.innerJoin(workout, eq(workout.id, superset.workoutId))
		.innerJoin(status, eq(status.id, workout.statusId))
		.where(and(eq(workout.userId, userId), eq(status.name, "done")))
		.orderBy(workout.date);

	const bestSupersetExerciseId = database
		.select({
			idw: supersetExercise.id,
			exerciseId: supersetExercise.exerciseId,
			maxValue: sql<number>`max(${setWeight.weight} * ${setWeight.repetition})`,
		})
		.from(workout)
		.where(and(eq(workout.userId, userId), eq(status.name, "done"), eq(exercise.id, supersetExercise.exerciseId)))
		.innerJoin(status, eq(status.id, workout.statusId))
		.innerJoin(superset, eq(superset.workoutId, workout.id))
		.innerJoin(supersetExercise, eq(supersetExercise.supersetId, superset.id))
		.innerJoin(setWeight, eq(setWeight.supersetExerciseId, supersetExercise.id))
		.groupBy(supersetExercise.id, workout.date)
		// @ts-ignore
		.orderBy(desc("maxValue"), asc(workout.date))
		.limit(1);

	const bestSupersetExercises = sql<number>`(select "supersetExercise".id from exercise
		inner join lateral ${bestSupersetExerciseId} "supersetExercise" on true)`;

	const exerciseWorkout = database
		.select({ date: workout.date })
		.from(workout)
		.where(and(eq(workout.userId, userId), eq(exercise.id, supersetExercise.exerciseId)))
		.innerJoin(status, eq(status.id, workout.statusId))
		.innerJoin(superset, eq(superset.workoutId, workout.id))
		.innerJoin(supersetExercise, eq(supersetExercise.supersetId, superset.id));

	const supersetExerciseDate = sql<string>`(
		select "exerciseWorkout".date from exercise
		inner join lateral ${exerciseWorkout} "exerciseWorkout" on true limit 1
	)`;

	return database.query.category.findMany({
		columns: dbQueryOmit,
		where: or(eq(category.userId, userId), isNull(category.userId)),
		with: {
			exercises: {
				columns: { ...dbQueryOmit },
				where: or(eq(exercise.userId, userId), isNull(exercise.userId)),
				with: {
					unit: {
						columns: dbQueryOmit,
					},
					supersetExercises: {
						columns: { ...dbQueryOmit },
						with: {
							sets: {
								columns: { ...dbQueryOmit },
							},
						},
						where: inArray(supersetExercise.supersetId, usersSupersetIds),
						extras: {
							date: supersetExerciseDate.as("date"),
						},
					},
					bestWorkouts: {
						columns: { ...dbQueryOmit },
						where: inArray(supersetExercise.id, bestSupersetExercises),
						with: {
							sets: {
								columns: { ...dbQueryOmit },
							},
						},
						extras: {
							date: supersetExerciseDate.as("date"),
						},
					},
				},
				extras: {
					isGlobal: sql<boolean>`(${exercise.userId} IS NULL)`.as("is_global"),
				},
			},
		},
		extras: {
			isGlobal: sql<boolean>`(${category.userId} IS NULL)`.as("is_global"),
		},
	});
};

export default async (userId: string, database: Database = db): Promise<PageExercisesData> => {
	const unitsPromise = db.select({ id: unit.id, name: unit.name }).from(unit);

	const categoriesPromise = dbCategoriesExercisesPromise(userId, database);

	const [units, categories] = await Promise.all([unitsPromise, categoriesPromise]);

	const mappedCategories: PageCategory[] = categories.map((category) => ({
		...category,
		exercises: category.exercises?.map((exercise) => ({
			...exercise,
			bestWorkout: exercise.bestWorkouts.length ? exercise.bestWorkouts[0] : undefined,
			workoutHistory: exercise.supersetExercises.length ? exercise.supersetExercises : undefined,
		})),
	}));

	return { units, categories: mappedCategories };
};
