import db from "$src/lib/server/db";
import { dbQueryOmit, getUserId } from "$src/lib/server/dbHelpers";
import { handleError } from "$src/lib/server/error";
import { eq } from "drizzle-orm";
import type { PagePlannedWorkouts } from "./types";
import { workout } from "$src/db/schema/workout";
import type { HttpError } from "@sveltejs/kit";

export async function load({ locals }): Promise<PagePlannedWorkouts | HttpError> {
	try {
		const userId = await getUserId(locals);

		const plannedWorkouts = await db.query.workout.findMany({
			where: eq(workout.userId, userId),
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

		// map workouts so that the category is not in exercise but in supersetExercise
		const mappedWorkouts: PagePlannedWorkouts = {
			plannedWorkouts: plannedWorkouts.map((workout) => ({
				...workout,
				supersets: workout.supersets.map((superset) => ({
					...superset,
					supersetExercises: superset.supersetExercise.map((supersetExercise) => ({
						...supersetExercise,
						exercise: {
							id: supersetExercise.exercise.id,
							name: supersetExercise.exercise.name,
						},
						category: supersetExercise.exercise.category,
					})),
				})),
			})),
		};

		return mappedWorkouts;
	} catch (error) {
		throw handleError(error);
	}
}
