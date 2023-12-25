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
import { STATUS, status } from "$src/db/schema/status";
import { unit } from "$src/db/schema/unit";
import type { PageCategory, PageExercisesData } from "$src/routes/exercises/types";

export const bestSupersetExerciseId = (userId: string, database: Database = db) => {
	return (
		database
			.select({
				idw: supersetExercise.id,
				exerciseId: supersetExercise.exerciseId,
				maxValue: sql<number>`max(${setWeight.weight} * ${setWeight.repetition})`,
			})
			.from(workout)
			.where(
				and(
					eq(workout.userId, userId),
					eq(status.name, STATUS.done),
					eq(exercise.id, supersetExercise.exerciseId),
				),
			)
			.innerJoin(status, eq(status.id, workout.statusId))
			.innerJoin(superset, eq(superset.workoutId, workout.id))
			.innerJoin(supersetExercise, eq(supersetExercise.supersetId, superset.id))
			.innerJoin(setWeight, eq(setWeight.supersetExerciseId, supersetExercise.id))
			.groupBy(supersetExercise.id, workout.date)
			// @ts-ignore
			.orderBy(desc("maxValue"), asc(workout.date))
			.limit(1)
	);
};

export const bestSupersetExercises = (userId: string, database: Database = db) => {
	return sql<number>`(select "supersetExercise".id from exercise
		inner join lateral ${bestSupersetExerciseId(userId, database)} "supersetExercise" on true)`;
};

export const dbSupersetExerciseDate = (userId: string, database: Database = db) => {
	const exerciseWorkout = database
		.select({ date: workout.date })
		.from(workout)
		.where(and(eq(workout.userId, userId), eq(exercise.id, supersetExercise.exerciseId)))
		.innerJoin(status, eq(status.id, workout.statusId))
		.innerJoin(superset, eq(superset.workoutId, workout.id))
		.innerJoin(supersetExercise, eq(supersetExercise.supersetId, superset.id));

	return sql<string>`(
		select "exerciseWorkout".date from exercise
		inner join lateral ${exerciseWorkout} "exerciseWorkout" on true limit 1
	)`;
};

export const dbCategoriesExercisesPromise = (userId: string, database: Database = db) => {
	const usersSupersetIds = database
		.select({ supersetId: superset.id })
		.from(superset)
		.innerJoin(workout, eq(workout.id, superset.workoutId))
		.innerJoin(status, eq(status.id, workout.statusId))
		.where(and(eq(workout.userId, userId), eq(status.name, STATUS.done)))
		.orderBy(workout.date);

	return database.query.category.findMany({
		columns: dbQueryOmit,
		where: or(eq(category.userId, userId), isNull(category.userId)),
		orderBy: asc(category.name),
		with: {
			exercises: {
				columns: { ...dbQueryOmit },
				where: or(eq(exercise.userId, userId), isNull(exercise.userId)),
				orderBy: asc(exercise.name),
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
							date: dbSupersetExerciseDate(userId, database).as("date"),
						},
					},
					bestWorkouts: {
						columns: { ...dbQueryOmit },
						where: inArray(supersetExercise.id, bestSupersetExercises(userId, database)),
						with: {
							sets: {
								columns: { ...dbQueryOmit },
							},
						},
						extras: {
							date: dbSupersetExerciseDate(userId, database).as("date"),
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

export const dbMapCategories = (
	categories: Awaited<ReturnType<typeof dbCategoriesExercisesPromise>>,
): PageCategory[] => {
	return categories.map((category) => ({
		...category,
		exercises: category.exercises?.map((exercise) => {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { bestWorkouts, ...newExercise } = {
				...exercise,
				bestWorkout: exercise.bestWorkouts.length ? exercise.bestWorkouts[0] : undefined,
				workoutHistory: exercise.supersetExercises.length ? exercise.supersetExercises : undefined,
			};

			return newExercise;
		}),
	}));
};

export default async (userId: string, database: Database = db): Promise<PageExercisesData> => {
	const unitsPromise = db.select({ id: unit.id, name: unit.name }).from(unit);

	const categoriesPromise = dbCategoriesExercisesPromise(userId, database);

	const [units, categories] = await Promise.all([unitsPromise, categoriesPromise]);

	const mappedCategories: PageCategory[] = dbMapCategories(categories);

	return { units, categories: mappedCategories };
};
