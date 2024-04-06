import { MAX_DROPDOWN_ITEMS, MAX_TEXT_LENGTH } from "$src/lib/constants";
import db from "$src/lib/server/db";
import { z } from "zod";
import { handleError } from "$src/lib/server/error";
import { dbQueryOmit, getUserId } from "$lib/server/dbHelpers";
import { json } from "@sveltejs/kit";
import { eq, isNull, sql, or } from "drizzle-orm";
import { exercise } from "$src/db/schema/exercise";
import { category } from "$src/db/schema/category";
import type { ExerciseSearchResult } from "./types.js";

export async function GET({ url, locals }) {
	try {
		const userId = await getUserId(locals);

		const schema = z.object({
			text: z.string().max(MAX_TEXT_LENGTH),
			limit: z.number().int().positive().max(100).nullable(),
		});

		const search = schema.parse({
			text: url.searchParams.get("text"),
			limit: parseInt(url.searchParams.get("limit") || "100"),
		});

		let transformedExercises: ExerciseSearchResult[] = [];

		if (!search.text.length) {
			// todo make it based on the user's most used exercises
			const returnedFullExercises = await db.query.exercise.findMany({
				where: or(eq(exercise.userId, userId), isNull(exercise.userId)),
				columns: { ...dbQueryOmit },
				with: {
					category: {
						columns: { ...dbQueryOmit },
						extras: {
							isGlobal: sql<boolean>`(${category.userId} IS NULL)`.as("is_global"),
						},
					},
					unit: {
						columns: { ...dbQueryOmit },
					},
				},
				extras: {
					isGlobal: sql<boolean>`(${exercise.userId} IS NULL)`.as("is_global"),
				},
				orderBy: (_, { desc }) => [desc(sql`random()`)],
				limit: search.limit || MAX_DROPDOWN_ITEMS,
			});

			transformedExercises = returnedFullExercises.map((fullExercise) => ({
				category: {
					...fullExercise.category,
				},
				exercise: {
					id: fullExercise.id,
					name: fullExercise.name,
					isGlobal: fullExercise.isGlobal,
				},
				unit: fullExercise.unit,
			}));

			transformedExercises = transformedExercises.slice(0, MAX_DROPDOWN_ITEMS);
		} else {
			const returnedFullExercises = (await db.execute(
				sql`SELECT
				category, name, exercise_id as "exerciseId", category_id as "categoryId",
				"category_userId" as "categoryUserId", "exercise_userId" as "exerciseUserId",
				unit_id as "unitId", unit
				FROM execute_exercise_search(
					${search.text.trimEnd()}, ${userId}, ${search.limit || MAX_DROPDOWN_ITEMS}, false)`,
			)) as Array<{
				categoryId: number;
				category: string;
				name: string;
				exerciseId: number;
				categoryUserId: string;
				exerciseUserId: string;
				unitId: number;
				unit: string;
			}>;

			transformedExercises = returnedFullExercises.map((fullExercise) => ({
				category: {
					id: fullExercise.categoryId,
					name: fullExercise.category,
					isGlobal: fullExercise.categoryUserId === null,
				},
				exercise: {
					id: fullExercise.exerciseId,
					name: fullExercise.name,
					isGlobal: fullExercise.exerciseUserId === null,
				},
				unit: {
					id: fullExercise.unitId,
					name: fullExercise.unit,
				},
			}));
		}

		return json(transformedExercises);
	} catch (error) {
		const errorResponse = handleError(error);
		return new Response(errorResponse.body.message, { status: errorResponse.status });
	}
}
