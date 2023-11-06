import type { PageInsertWorkout, PagePlannedWorkout, PagePlannedWorkouts } from "$src/routes/workouts/types";
import { and, eq, sql } from "drizzle-orm";
import { dbQueryOmit } from "./dbHelpers";
import type { Database } from "./dbTypes";
import db from "./db";
import { category } from "$src/db/schema/category";
import { exercise } from "$src/db/schema/exercise";
import { workout } from "$src/db/schema/workout";
import { superset } from "$src/db/schema/superset";
import { status } from "$src/db/schema/status";
import { supersetExercise } from "$src/db/schema/supersetExercise";
import { error } from "@sveltejs/kit";

export const dbGetPlannedWorkoutsPromise = (userId: string, database?: Database) => {
	const databaseConnection = database || db;
	return databaseConnection.query.workout.findMany({
		where: eq(workout.userId, userId),
		columns: {
			...dbQueryOmit,
			date: false,
			note: false,
		},
		orderBy: (workout, { asc }) => [asc(workout.order)],
		with: {
			supersets: {
				columns: {
					...dbQueryOmit,
				},
				orderBy: (superset, { asc }) => [asc(superset.order)],
				with: {
					supersetExercise: {
						columns: {
							...dbQueryOmit,
						},
						orderBy: (supersetExercise, { asc }) => [asc(supersetExercise.order)],
						with: {
							exercise: {
								columns: {
									...dbQueryOmit,
								},
								with: {
									category: {
										columns: {
											...dbQueryOmit,
										},
										extras: {
											isGlobal: sql<boolean>`(${category.userId} IS NULL)`.as("is_global"),
										},
									},
								},
								extras: {
									isGlobal: sql<boolean>`(${exercise.userId} IS NULL)`.as("is_global"),
								},
							},
						},
					},
				},
			},
		},
	});
};

export const dbGetPlannedWorkoutPromise = (userId: string, workoutId: number, database?: Database) => {
	const databaseConnection = database || db;
	return databaseConnection.query.workout.findFirst({
		where: and(eq(workout.id, workoutId), eq(workout.userId, userId)),
		columns: {
			...dbQueryOmit,
			date: false,
			note: false,
		},
		with: {
			supersets: {
				columns: {
					...dbQueryOmit,
				},
				orderBy: (superset, { asc }) => [asc(superset.order)],
				with: {
					supersetExercise: {
						columns: {
							...dbQueryOmit,
						},
						orderBy: (supersetExercise, { asc }) => [asc(supersetExercise.order)],

						with: {
							exercise: {
								columns: {
									...dbQueryOmit,
								},
								with: {
									category: {
										columns: {
											...dbQueryOmit,
										},
										extras: {
											isGlobal: sql<boolean>`(${exercise.userId} IS NULL)`.as("is_global"),
										},
									},
								},
								extras: {
									isGlobal: sql<boolean>`(${exercise.userId} IS NULL)`.as("is_global"),
								},
							},
						},
					},
				},
			},
		},
	});
};

export const mapPlannedWorkouts = (
	dbWorkout: Awaited<ReturnType<typeof dbGetPlannedWorkoutsPromise>>,
): PagePlannedWorkouts => {
	return {
		plannedWorkouts: dbWorkout.map((workout) => ({
			...workout,
			supersets: workout.supersets.map((superset) => ({
				...superset,
				supersetExercises: superset.supersetExercise.map((supersetExercise) => ({
					...supersetExercise,
					exercise: {
						id: supersetExercise.exercise.id,
						name: supersetExercise.exercise.name,
						isGlobal: supersetExercise.exercise.isGlobal,
					},
					category: supersetExercise.exercise.category,
				})),
			})),
		})),
	};
};

export const mapPlannedWorkout = (
	dbWorkout: NonNullable<Awaited<ReturnType<typeof dbGetPlannedWorkoutPromise>>>,
): PagePlannedWorkout => {
	return {
		...dbWorkout,
		supersets: dbWorkout.supersets.map((superset) => ({
			...superset,
			supersetExercises: superset.supersetExercise.map((supersetExercise) => ({
				...supersetExercise,
				exercise: {
					id: supersetExercise.exercise.id,
					name: supersetExercise.exercise.name,
					isGlobal: supersetExercise.exercise.isGlobal,
				},
				category: supersetExercise.exercise.category,
			})),
		})),
	};
};

export const dbPostPlannedWorkoutPromise = (userId: string, newWorkout: PageInsertWorkout, database?: Database) => {
	const databaseConnection = database || db;

	return databaseConnection.transaction(async (transaction) => {
		const statusId = await transaction.query.status.findFirst({
			columns: {
				id: true,
			},
			where: eq(status.name, "planned"),
		});

		console.log("daf", newWorkout.order);
		const workoutId = await transaction
			.insert(workout)
			.values({
				userId,
				statusId: statusId?.id || -1,
				order: newWorkout.order,
			})
			// @ts-ignore
			.returning({ id: workout.id });

		const supersetsIds = await transaction
			.insert(superset)
			.values(
				newWorkout.supersets.map(() => ({
					workoutId: workoutId[0].id,
				})),
			)
			// @ts-ignore
			.returning({ id: superset.id });

		const supersetExercises = newWorkout.supersets.map((superset, supersetIndex) => {
			return superset.supersetExercises.map((activity) => ({
				exerciseId: activity.exercise.id,
				supersetId: supersetsIds[supersetIndex].id,
			}));
		});

		await transaction.insert(supersetExercise).values(supersetExercises.flat());

		const insertedWorkout = await dbGetPlannedWorkoutPromise(userId, workoutId[0].id, transaction);

		if (!insertedWorkout) {
			throw error(404, "Workout not found");
		}

		return mapPlannedWorkout(insertedWorkout);
	});
};

export default async (userId: string, database?: Database) => {
	const plannedWorkouts = await dbGetPlannedWorkoutsPromise(userId, database);
	return mapPlannedWorkouts(plannedWorkouts);
};
