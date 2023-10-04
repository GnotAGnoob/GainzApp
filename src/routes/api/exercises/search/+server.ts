import { MAX_TEXT_LENGTH } from "$src/lib/constants";
import db from "$src/lib/server/db";
import { z } from "zod";
import { handleError } from "$src/lib/server/error";
import { getUserId } from "$src/lib/server/dbHelpers";
import { json } from "@sveltejs/kit";
import { sql } from "drizzle-orm";
import type { PageExercise } from "$src/routes/workouts/types";

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

		const returnedFullExercises = (await db.execute(
			sql`SELECT
			category, name, exercise_id as "exerciseId", category_id as "categoryId"
			FROM execute_exercise_search(${search.text.trimEnd()}, ${userId}, ${search.limit}, false)`,
		)) as Array<{ categoryId: number; category: string; name: string; exerciseId: number }>;

		const transformedExercises: PageExercise[] = returnedFullExercises.map((fullExercise) => ({
			category: {
				id: fullExercise.categoryId,
				name: fullExercise.category,
			},
			exercise: {
				id: fullExercise.exerciseId,
				name: fullExercise.name,
			},
		}));

		return json(transformedExercises);
	} catch (error) {
		const errorResponse = handleError(error);
		return new Response(errorResponse.body.message, { status: errorResponse.status });
	}
}
