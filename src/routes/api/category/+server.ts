import { category } from "$src/db/schema/category.js";
import { MAX_TEXT_LENGTH } from "$src/lib/constants";
import db from "$src/lib/server/db";
import { json } from "@sveltejs/kit";
import { z } from "zod";
import { getUserId } from "$src/lib/server/dbHelpers";
import { handleError } from "$src/lib/server/error.js";

export async function POST({ request, locals }) {
	try {
		const userId = await getUserId(locals);

		if (userId instanceof Response) {
			return userId;
		}

		const schema = z.string().max(MAX_TEXT_LENGTH);

		const newCategory = schema.parse(await request.json());

		const returnedCategory = await db
			.insert(category)
			.values({ name: newCategory, userId })
			.onConflictDoNothing()
			.returning();

		json({ name: returnedCategory[0].name });
	} catch (error) {
		return handleError(error);
	}
}
