import type { PageInsertFillWorkout, PageInsertPlanWorkout, PagePlannedWorkouts, PageWorkout } from "$src/routes/types";
import { and, eq, inArray, sql, asc, desc } from "drizzle-orm";
import { dbQueryOmit } from "./dbHelpers";
import type { Database, StatusId } from "./dbTypes";
import db from "./db";
import { category } from "$src/db/schema/category";
import { exercise } from "$src/db/schema/exercise";
import { workout } from "$src/db/schema/workout";
import { superset } from "$src/db/schema/superset";
import { STATUS, status } from "$src/db/schema/status";
import { supersetExercise } from "$src/db/schema/supersetExercise";
import { error } from "@sveltejs/kit";
import { setWeight, type InsertSetWeight } from "$src/db/schema/setWeight";

const bestSupersetExercises = (userId: string, database: Database = db) => {
	return sql`
		SELECT
		*
		FROM
		(
		SELECT
			se."id" AS "superset_exercise_id",
			se."exercise_id" AS "exercise_id",
			w.date as "date",
			ARRAY_AGG(
			JSON_BUILD_OBJECT(
				'set_id', sw."id",
				'repetition', sw."repetition",
				'weight', sw."weight"
			)
			) AS "sets",
			ROW_NUMBER() OVER (PARTITION BY se."exercise_id" ORDER BY SUM(sw."repetition" * sw."weight") DESC) AS "rnk"
		FROM
			"supersetExercise" se
			JOIN "setWeight" sw ON se."id" = sw."superset_exercise_id"
			JOIN "superset" s ON se."superset_id" = s."id"
			JOIN "workout" w ON s."workout_id" = w."id"
		WHERE
			w."userId" = ${userId}
			AND w."status_id" = ${database.select({ id: status.id }).from(status).where(eq(status.name, STATUS.done))}
		GROUP BY
			se."id", se."exercise_id", w.date
		) rse
		WHERE
		rse."rnk" = 1
	`;
};

export const bestSupersetExercise = (userId: string, database: Database = db) => {
	return sql<boolean>`(select JSON_BUILD_OBJECT(
		'id', superset_exercise_id,
		'sets', sets,
		'date', date
		) from (${bestSupersetExercises(userId, database)}) best limit 1)`;
};

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
		orderBy: (workout, { asc, desc }) => [statusId === "done" ? desc(workout.date) : asc(workout.order)],
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
									unit: {
										columns: {
											...dbQueryOmit,
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
									unit: {
										columns: {
											...dbQueryOmit,
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
	statusName: StatusId = STATUS.planned,
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
	const data = await dbInsertWorkout(userId, newWorkout, transaction, STATUS.done);

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

		const insertedWorkout = await dbGetWorkoutPromise(userId, workoutIds[0].id, STATUS.planned, transaction);

		if (!insertedWorkout) {
			throw error(404, "Workout not found");
		}

		return insertedWorkout;
	});
};

export default async (userId: string, database: Database = db): Promise<PagePlannedWorkouts> => {
	const [plannedWorkouts, workoutHistory] = await Promise.all([
		dbGetWorkoutsPromise(userId, STATUS.planned, database),
		// fucked date type
		dbGetWorkoutsPromise(userId, STATUS.done, database) as unknown as PageWorkout[],
	]);

	return { plannedWorkouts, workoutHistory };
};
