import type { PageInsertFillWorkout, PageInsertPlanWorkout, PagePlannedWorkouts } from "$src/routes/workouts/types";
import { and, eq, inArray, sql } from "drizzle-orm";
import { dbQueryOmit } from "./dbHelpers";
import type { Database, StatusId } from "./dbTypes";
import db from "./db";
import { category } from "$src/db/schema/category";
import { exercise } from "$src/db/schema/exercise";
import { workout } from "$src/db/schema/workout";
import { superset } from "$src/db/schema/superset";
import { status } from "$src/db/schema/status";
import { supersetExercise } from "$src/db/schema/supersetExercise";
import { error } from "@sveltejs/kit";
import { setWeight, type InsertSetWeight } from "$src/db/schema/setWeight";

export const dbGetWorkoutsPromise = (userId: string, statusId: StatusId, database: Database = db) => {
	return database.query.workout.findMany({
		where: and(
			eq(workout.userId, userId),
			inArray(workout.statusId, database.select({ id: status.id }).from(status).where(eq(status.name, statusId))),
		),
		columns: {
			...dbQueryOmit,
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
					supersetExercises: {
						columns: {
							...dbQueryOmit,
						},
						orderBy: (supersetExercises, { asc }) => [asc(supersetExercises.order)],
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
							sets: {
								columns: {
									...dbQueryOmit,
								},
							},
						},
						// extras: {
						// 	// todo
						// 	// workoutHistory: sql<boolean>`(${workout.statusId} = ${status.id.done})`.as(
						// 	// 	"workout_history",
						// 	// ),
						// 	// bestWorkout: sql<boolean>`(${workout.statusId} = ${status.id.done})`.as("best_workout"),
						// },
					},
				},
			},
		},
	});
};

export const dbGetWorkoutPromise = (userId: string, workoutId: number, statusId: StatusId, database: Database = db) => {
	return database.query.workout.findFirst({
		where: and(
			eq(workout.id, workoutId),
			eq(workout.userId, userId),
			inArray(workout.statusId, database.select({ id: status.id }).from(status).where(eq(status.name, statusId))),
		),
		columns: {
			...dbQueryOmit,
			note: false,
		},
		with: {
			supersets: {
				columns: {
					...dbQueryOmit,
				},
				orderBy: (superset, { asc }) => [asc(superset.order)],
				with: {
					supersetExercises: {
						columns: {
							...dbQueryOmit,
						},
						orderBy: (supersetExercises, { asc }) => [asc(supersetExercises.order)],

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
							sets: {
								columns: {
									...dbQueryOmit,
								},
							},
						},
					},
				},
			},
		},
	});
};

const dbInsertWorkout = async (
	userId: string,
	newWorkout: PageInsertPlanWorkout,
	transaction: Database,
	statusName: StatusId = "planned",
) => {
	const statusId = await transaction.query.status.findFirst({
		columns: {
			id: true,
		},
		where: eq(status.name, statusName),
	});

	const workoutIds = await transaction
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
				workoutId: workoutIds[0].id,
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

	const supersetExerciseIds = await transaction
		.insert(supersetExercise)
		.values(supersetExercises.flat())
		// @ts-ignore
		.returning({ id: superset.id });

	return {
		workoutIds,
		supersetExerciseIds,
		statusId,
		supersetsIds,
	};
};

export const dbInsertCompleteWorkout = async (
	userId: string,
	newWorkout: PageInsertFillWorkout,
	transaction: Database,
) => {
	const data = await dbInsertWorkout(userId, newWorkout, transaction, "done");

	const setWeightValues: InsertSetWeight[] = [];
	let index = 0;
	newWorkout.supersets.forEach((superset) =>
		superset.supersetExercises.forEach((activity) => {
			activity.sets.forEach((set) =>
				setWeightValues.push({
					...set,
					supersetExerciseId: data.supersetExerciseIds[index].id,
				}),
			);

			index++;
		}),
	);

	const setWeightIds = await transaction.insert(setWeight).values(setWeightValues).returning();

	return {
		...data,
		setWeightIds,
	};
};

export const dbPostPlannedWorkoutPromise = (userId: string, newWorkout: PageInsertPlanWorkout, database?: Database) => {
	const databaseConnection = database || db;

	return databaseConnection.transaction(async (transaction) => {
		const { workoutIds } = await dbInsertWorkout(userId, newWorkout, transaction);

		const insertedWorkout = await dbGetWorkoutPromise(userId, workoutIds[0].id, "planned", transaction);

		if (!insertedWorkout) {
			throw error(404, "Workout not found");
		}

		return insertedWorkout;
	});
};

export default async (userId: string, database?: Database): Promise<PagePlannedWorkouts> => {
	const [plannedWorkouts, workoutHistory] = await Promise.all([
		dbGetWorkoutsPromise(userId, "planned", database),
		dbGetWorkoutsPromise(userId, "done", database),
	]);

	return { plannedWorkouts, workoutHistory };
};
