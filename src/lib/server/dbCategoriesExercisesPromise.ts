import db from "$src/lib/server/db";
import { and, asc, eq, inArray, isNull, or, sql } from "drizzle-orm";
import { dbQueryOmit } from "./dbHelpers";
import { category } from "$src/db/schema/category";
import { exercise } from "$src/db/schema/exercise";
import type { Database, StatusId } from "./dbTypes";
import { supersetExercise } from "$src/db/schema/supersetExercise";
import { superset } from "$src/db/schema/superset";
import { workout } from "$src/db/schema/workout";
import { setWeight } from "$src/db/schema/setWeight";
import { STATUS, status } from "$src/db/schema/status";
import { unit } from "$src/db/schema/unit";
import type {
	PageCategory,
	PageDisplaySupersetExercise,
	PageExercise,
	PageExercisesData,
} from "$src/routes/exercises/types";
import { REPETITION_EMPHASIS } from "$lib/constants";

export const bestSupersetExercises = (userId: string, database: Database = db) => {
	const totalWeightAlias = sql<string>`"totalWeight"`.as("totalWeight");

	const totalWeights = database
		.select({
			id: supersetExercise.id,
			totalWeight: sql<number>`
				SUM(POWER("setWeight".repetition, ${REPETITION_EMPHASIS}) * ("setWeight".weight + 1)) AS "totalWeight"`,
		})
		.from(supersetExercise)
		.innerJoin(setWeight, eq(setWeight.supersetExerciseId, supersetExercise.id))
		.groupBy(supersetExercise.id)
		.as("totalWeights");

	const supersetExercises = database.$with("te").as(
		database
			.select({
				id: supersetExercise.id,
				exerciseId: supersetExercise.exerciseId,
				totalWeight: totalWeightAlias,
				rank: sql<number>`
				ROW_NUMBER() OVER 
				(PARTITION BY exercise.id ORDER BY "totalWeights"."totalWeight" DESC, workout.date ASC)
				AS rank`,
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
			.innerJoin(exercise, eq(exercise.id, supersetExercise.exerciseId))
			.innerJoin(category, eq(category.id, exercise.categoryId))
			.innerJoin(totalWeights, eq(totalWeights.id, supersetExercise.id))
			.groupBy(supersetExercise.id, exercise.id, workout.date, totalWeightAlias),
	);

	return database
		.with(supersetExercises)
		.select({
			id: supersetExercises.id,
		})
		.from(supersetExercises)
		.where(sql`rank = 1`);
};

const dbUsersSupersetIds = (userId: string, database: Database = db, statusName: StatusId = STATUS.done) => {
	return database
		.select({ supersetId: superset.id })
		.from(superset)
		.innerJoin(workout, eq(workout.id, superset.workoutId))
		.innerJoin(status, eq(status.id, workout.statusId))
		.where(and(eq(workout.userId, userId), eq(status.name, statusName)))
		.orderBy(workout.date);
};

export const dbCategoryExercisesPromise = (userId: string, categoryId: number, database: Database = db) => {
	return database.query.exercise.findMany({
		// columns: { ...dbQueryOmit },
		where: and(or(eq(exercise.userId, userId), isNull(exercise.userId)), eq(exercise.categoryId, categoryId)),
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
					superset: {
						columns: { ...dbQueryOmit },
						with: {
							workout: {
								columns: { ...dbQueryOmit },
							},
						},
					},
				},
				where: inArray(supersetExercise.supersetId, dbUsersSupersetIds(userId, database)),
			},
			bestWorkouts: {
				columns: { ...dbQueryOmit },
				where: inArray(supersetExercise.id, bestSupersetExercises(userId, database)),
				with: {
					sets: {
						columns: { ...dbQueryOmit },
					},
					superset: {
						columns: { ...dbQueryOmit },
						with: {
							workout: {
								columns: { ...dbQueryOmit },
							},
						},
					},
				},
			},
		},
		extras: {
			isGlobal: sql<boolean>`(${exercise.userId} IS NULL)`.as("is_global"),
		},
	});
};

export const dbCategoriesExercisesPromise = (userId: string, database: Database = db) => {
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
							superset: {
								columns: { ...dbQueryOmit },
								with: {
									workout: {
										columns: { ...dbQueryOmit },
									},
								},
							},
						},
						where: inArray(supersetExercise.supersetId, dbUsersSupersetIds(userId, database)),
						orderBy: (supersetExercise, { desc }) =>
							desc(
								db
									.select({ date: workout.date })
									.from(workout)
									.innerJoin(superset, eq(superset.workoutId, workout.id))
									.where(eq(superset.id, supersetExercise.supersetId)),
							),
					},
					bestWorkouts: {
						columns: { ...dbQueryOmit },
						where: inArray(supersetExercise.id, bestSupersetExercises(userId, database)),
						with: {
							sets: {
								columns: { ...dbQueryOmit },
							},
							superset: {
								columns: { ...dbQueryOmit },
								with: {
									workout: {
										columns: { ...dbQueryOmit },
									},
								},
							},
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

type dbExercise = Awaited<ReturnType<typeof dbCategoriesExercisesPromise>>[0]["exercises"][0];

type dbSupersetExercise = dbExercise["supersetExercises"][0];

export const mapSupersetExercises = (supersetExercises: dbSupersetExercise[]): PageDisplaySupersetExercise[] => {
	return supersetExercises.map((supersetExercise) => {
		const { superset, ...rest } = supersetExercise;
		return {
			...rest,
			sets: rest.sets.map((set) => ({
				...set,
				weight: set.weight ?? undefined,
				repetition: set.repetition ?? undefined,
			})),
			date: superset.workout.date.toISOString(),
		};
	});
};

export const dbMapCategoryExercises = (exercises: dbExercise[]): PageExercise[] => {
	return exercises.map((exercise) => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { bestWorkouts, ...newExercise } = {
			...exercise,
			bestWorkout: exercise.bestWorkouts.length ? mapSupersetExercises(exercise.bestWorkouts)[0] : undefined,
			workoutHistory: exercise.supersetExercises.length
				? mapSupersetExercises(exercise.supersetExercises)
				: undefined,
		};

		return newExercise;
	});
};

export const dbMapCategories = (
	categories: Awaited<ReturnType<typeof dbCategoriesExercisesPromise>>,
): PageCategory[] => {
	return categories.map((category) => ({
		...category,
		exercises: dbMapCategoryExercises(category.exercises),
	}));
};

export default async (userId: string, database: Database = db): Promise<PageExercisesData> => {
	const unitsPromise = db.select({ id: unit.id, name: unit.name }).from(unit);

	const categoriesPromise = dbCategoriesExercisesPromise(userId, database);

	const [units, categories] = await Promise.all([unitsPromise, categoriesPromise]);

	const mappedCategories: PageCategory[] = dbMapCategories(categories);

	return { units, categories: mappedCategories };
};
