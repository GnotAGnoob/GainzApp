import { z } from "zod";
import { handleError } from "$src/lib/server/error";
import { dbQueryOmit, getUserId } from "$src/lib/server/dbHelpers";
import { json } from "@sveltejs/kit";
import db from "$src/lib/server/db";
import { and, eq, inArray } from "drizzle-orm";
import { exercise } from "$src/db/schema/exercise";
import { supersetExercise } from "$src/db/schema/supersetExercise.js";
import { workout } from "$src/db/schema/workout.js";
import { superset } from "$src/db/schema/superset.js";
import type { WorkoutHistory } from "./types";
import { bestSupersetExercises, dbSupersetExerciseDate } from "$src/lib/server/dbCategoriesExercisesPromise";
import { STATUS, status } from "$src/db/schema/status";

export async function POST({ request, locals }) {
	try {
		const userId = await getUserId(locals);

		const schema = z.array(z.number().positive());

		const xc = await request.json();

		const exerciseIds = schema.parse(xc);

		const supersetExerciseIds = db
			.select({ id: supersetExercise.id })
			.from(supersetExercise)
			.innerJoin(superset, eq(superset.id, supersetExercise.supersetId))
			.innerJoin(workout, eq(workout.id, superset.workoutId))
			.innerJoin(status, eq(status.id, workout.statusId))
			.where(
				and(
					eq(workout.userId, userId),
					inArray(supersetExercise.exerciseId, exerciseIds),
					eq(status.name, STATUS.done),
				),
			);

		const data = await db.query.exercise.findMany({
			columns: {
				...dbQueryOmit,
				id: true,
			},
			where: inArray(exercise.id, exerciseIds),
			with: {
				supersetExercises: {
					columns: {
						...dbQueryOmit,
					},
					where: inArray(supersetExercise.id, supersetExerciseIds),
					with: {
						sets: {
							columns: {
								...dbQueryOmit,
							},
						},
					},
					extras: {
						date: dbSupersetExerciseDate(userId, db).as("date"),
					},
				},
				bestWorkouts: {
					columns: { ...dbQueryOmit },
					where: and(
						inArray(supersetExercise.id, bestSupersetExercises(userId, db)),
						inArray(supersetExercise.id, supersetExerciseIds),
					),
					with: {
						sets: {
							columns: { ...dbQueryOmit },
						},
					},
					extras: {
						date: dbSupersetExerciseDate(userId, db).as("date"),
					},
				},
			},
		});

		const remappedData: WorkoutHistory[] = data.map((exercise) => {
			const { supersetExercises, bestWorkouts, ...rest } = exercise;

			return {
				...rest,
				workoutHistory: supersetExercises.map((supersetExercise) => ({
					...supersetExercise,
				})),
				bestWorkout: bestWorkouts[0],
			};
		});
		console.log(remappedData);
		return json(remappedData);
	} catch (error) {
		const errorResponse = handleError(error);
		return new Response(errorResponse.body.message, { status: errorResponse.status });
	}
}
