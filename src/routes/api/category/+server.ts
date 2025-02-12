import { category } from "$src/db/schema/category";
import { MAX_TEXT_LENGTH } from "$src/lib/constants";
import db from "$src/lib/server/db";
import { json } from "@sveltejs/kit";
import { z } from "zod";
import { getUserId } from "$src/lib/server/dbHelpers";
import { handleError } from "$src/lib/server/error";

export async function POST({ request, locals }) {
	try {
		const userId = await getUserId(locals);

		const schema = z.string().max(MAX_TEXT_LENGTH);
		const newCategory = schema.parse(await request.text());

		let returnedCategory: { name: string; id: number }[] = [];
		await db.transaction(async (transaction) => {
			returnedCategory = await transaction
				.insert(category)
				.values({ name: newCategory.toLowerCase(), userId })
				// @ts-ignore
				.returning({ id: category.id, name: category.name });
		});

		return json({ ...returnedCategory[0], isGlobal: false });
	} catch (error) {
		const errorResponse = handleError(error);
		return new Response(errorResponse.body.message, { status: errorResponse.status });
	}
}
