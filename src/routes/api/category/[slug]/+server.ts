import { category } from "$src/db/schema/category.js";
import { MAX_TEXT_LENGTH } from "$src/lib/constants";
import db from "$src/lib/server/db";
import { z } from "zod";
import { handleError } from "$src/lib/server/error";
import { getUserId } from "$src/lib/server/dbHelpers";
import { and, eq } from "drizzle-orm";
import { json } from "@sveltejs/kit";

export async function PATCH({ request, locals, params }) {
	try {
		const userId = await getUserId(locals);

		if (userId instanceof Response) {
			return userId;
		}

		const schema = z.object({
			id: z.number().int().positive().min(1),
			name: z.string().max(MAX_TEXT_LENGTH),
		});

		const updatedCategory = schema.parse({
			id: parseInt(params.slug),
			...(await request.json()),
		});

		const returnedCategory = await db
			.update(category)
			.set({ name: updatedCategory.name })
			.where(and(eq(category.id, updatedCategory.id), eq(category.userId, userId)))
			.returning();

		if (!returnedCategory.length) {
			return new Response("Category not found", { status: 404 });
		}

		return json({
			id: returnedCategory[0].id,
			name: returnedCategory[0].name,
		});
	} catch (error) {
		return handleError(error);
	}
}
