import { MAX_TEXT_LENGTH } from "$src/lib/constants";
import db from "$src/lib/server/db";
import { z } from "zod";
import { handleError } from "$src/lib/server/error";
import { getUserId } from "$src/lib/server/dbHelpers";
import { json } from "@sveltejs/kit";
import { sql } from "drizzle-orm";
import type { Exercise } from "$src/db/schema/exercise.js";
import type { Category } from "$src/db/schema/category.js";

export async function GET({ url, locals }) {
	try {
		const userId = await getUserId(locals);

		if (userId instanceof Response) {
			return userId;
		}

		const schema = z.object({
			text: z.string().max(MAX_TEXT_LENGTH),
			limit: z.number().int().positive().max(100).nullable(),
		});

		const exercise = schema.parse({
			text: url.searchParams.get("text"),
			limit: parseInt(url.searchParams.get("limit") || "100"),
		});

		const returnedExercises = (await db.execute(
			sql`SELECT
			category, name, exercise_id as "exerciseId", category_id as "categoryId"
			FROM execute_exercise_search(${exercise.text}, ${userId}, ${exercise.limit})`,
		)) as Array<{ categoryId: number; category: string; name?: string; exerciseId?: number }>;

		const transformedExercises = returnedExercises.map((exercise) => ({
			category: {
				id: exercise.categoryId,
				name: exercise.category,
			},
			exercise: {
				id: exercise.exerciseId,
				name: exercise.name,
			},
		}));

		return json(transformedExercises);
	} catch (error) {
		return handleError(error);
	}
}
