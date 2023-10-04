import { category } from "$src/db/schema/category";
import { unit } from "$src/db/schema/unit";
import db from "$src/lib/server/db";
import { dbQueryOmit, getUserId } from "$src/lib/server/dbHelpers";
import { handleError } from "$src/lib/server/error";
import { eq } from "drizzle-orm";
import type { PageExercisesData } from "./types";
import type { HttpError } from "@sveltejs/kit";

export async function load({ locals }): Promise<PageExercisesData | HttpError> {
	try {
		const userId = await getUserId(locals);

		const unitsPromise = db.select({ id: unit.id, name: unit.name }).from(unit);

		// todo dokoncit query
		const categoriesPromise = db.query.category.findMany({
			columns: dbQueryOmit,
			where: eq(category.userId, userId),
			with: {
				exercises: {
					columns: { ...dbQueryOmit, categoryId: false, unitId: false },
					with: {
						unit: {
							columns: dbQueryOmit,
						},
					},
				},
			},
		});

		const [units, categories] = await Promise.all([unitsPromise, categoriesPromise]);

		return {
			units,
			categories,
		};
	} catch (error) {
		throw handleError(error);
	}
}
