import db from "$src/lib/server/db";
import { dbQueryOmit, getUserId } from "$src/lib/server/dbHelpers";
import { handleError } from "$src/lib/server/error";
import { eq, sql } from "drizzle-orm";
import type { PagePlannedWorkouts } from "./types";
import { workout } from "$src/db/schema/workout";
import type { HttpError } from "@sveltejs/kit";
import { category } from "$src/db/schema/category";
import { exercise } from "$src/db/schema/exercise";

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
							isGlobal: supersetExercise.exercise.isGlobal,
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
