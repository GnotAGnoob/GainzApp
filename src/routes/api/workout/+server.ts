import { MAX_TEXT_LENGTH } from "$src/lib/constants";
import db from "$src/lib/server/db";
import { z } from "zod";
import { status } from "$src/db/schema/status";
import { dbQueryOmit, getUserId } from "$src/lib/server/dbHelpers";
import { eq } from "drizzle-orm";
import { error, json } from "@sveltejs/kit";
import { workout } from "$src/db/schema/workout";
import { superset } from "$src/db/schema/superset";
import { supersetExercise } from "$src/db/schema/supersetExercise";
import type { PagePlannedWorkout } from "$src/routes/workouts/types";
import { handleError } from "$src/lib/server/error";

export async function POST({ request, locals }) {
	try {
		const userId = await getUserId(locals);

		const schema = z.object({
			supersets: z.array(
				z.object({
					supersetExercises: z.array(
						z.object({
							category: z.object({
								id: z.number(),
								name: z.string().max(MAX_TEXT_LENGTH),
							}),
							exercise: z.object({
								id: z.number(),
								name: z.string().max(MAX_TEXT_LENGTH),
							}),
						}),
					),
				}),
			),
		});

		const parsedWorkout = schema.parse(await request.json());

		let returnedWorkout: PagePlannedWorkout | undefined;

		await db.transaction(async (transaction) => {
			const statusId = await transaction.query.status.findFirst({
				columns: {
					id: true,
				},
				where: eq(status.name, "planned"),
			});

			const workoutId = await transaction
				.insert(workout)
				.values({
					userId,
					statusId: statusId?.id || -1,
				})
				// @ts-ignore
				.returning({ id: workout.id });

			const supersetsIds = await transaction
				.insert(superset)
				.values(
					parsedWorkout.supersets.map(() => ({
						workoutId: workoutId[0].id,
					})),
				)
				// @ts-ignore
				.returning({ id: superset.id });

			const supersetExercises = parsedWorkout.supersets.map((superset, supersetIndex) => {
				return superset.supersetExercises.map((activity) => ({
					exerciseId: activity.exercise.id,
					supersetId: supersetsIds[supersetIndex].id,
				}));
			});

			await transaction.insert(supersetExercise).values(supersetExercises.flat());

			const insertedWorkout = await transaction.query.workout.findFirst({
				where: eq(workout.id, workoutId[0].id),
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
											},
										},
									},
								},
							},
						},
					},
				},
			});

			if (!insertedWorkout) {
				throw error(404, "Workout not found");
			}

			returnedWorkout = {
				id: insertedWorkout.id,
				supersets: insertedWorkout.supersets.map((superset) => ({
					id: superset.id,
					supersetExercises: superset.supersetExercise.map((supersetExercise) => ({
						...supersetExercise,
						category: supersetExercise.exercise.category,
						exercise: {
							id: supersetExercise.exercise.id,
							name: supersetExercise.exercise.name,
						},
					})),
				})),
			};
		});

		return json(returnedWorkout);
	} catch (error) {
		const errorResponse = handleError(error);
		return new Response(errorResponse.body.message, { status: errorResponse.status });
	}
}

// on update update workout set "order" = 1 where id = 9;
