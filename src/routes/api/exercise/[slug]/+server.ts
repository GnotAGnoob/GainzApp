import { MAX_TEXT_LENGTH } from "$src/lib/constants";
import db from "$src/lib/server/db";
import { z } from "zod";
import { exercise } from "$src/db/schema/exercise";
import { handleError } from "$src/lib/server/error";
import { getUserId } from "$src/lib/server/dbHelpers";
import { and, eq } from "drizzle-orm";
import { json } from "@sveltejs/kit";
import { dbCategoryExercisesPromise, dbMapCategoryExercises } from "$src/lib/server/dbCategoriesExercisesPromise";
import type { PageExercise } from "$src/routes/exercises/types.js";

export async function PATCH({ request, locals, params }) {
	try {
		const userId = await getUserId(locals);

		const schema = z.object({
			id: z.number().int().positive().min(1),
			name: z.string().max(MAX_TEXT_LENGTH),
		});

		const updatedExercise = schema.parse({
			id: parseInt(params.slug),
			...(await request.json()),
		});

		const returnedCategory = await db
			.update(exercise)
			.set({ name: updatedExercise.name })
			.where(and(eq(exercise.id, updatedExercise.id), eq(exercise.userId, userId)))
			.returning();

		if (!returnedCategory.length) {
			return new Response("Exercise not found", { status: 404 });
		}

		return json({
			id: returnedCategory[0].id,
			name: returnedCategory[0].name,
			categoryId: returnedCategory[0].categoryId,
		});
	} catch (error) {
		const errorResponse = handleError(error);
		return new Response(errorResponse.body.message, { status: errorResponse.status });
	}
}

export async function DELETE({ locals, params }) {
	try {
		const userId = await getUserId(locals);

		const schema = z.number().int().positive().min(1);

		const exerciseId = schema.parse(parseInt(params.slug));

		const returnedExercise = await db
			.delete(exercise)
			.where(and(eq(exercise.id, exerciseId), eq(exercise.userId, userId)))
			.returning();

		if (!returnedExercise.length) {
			return new Response("Exercise not found", { status: 404 });
		}

		const categoryExercises = await dbCategoryExercisesPromise(userId, returnedExercise[0].categoryId);
		const mappedCategoryExercises: PageExercise[] = dbMapCategoryExercises(categoryExercises);

		return json(mappedCategoryExercises);
	} catch (error) {
		const errorResponse = handleError(error);
		return new Response(errorResponse.body.message, { status: errorResponse.status });
	}
}
