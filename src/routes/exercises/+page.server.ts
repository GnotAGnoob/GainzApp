import { unit } from "$src/db/schema/unit";
import db from "$src/lib/server/db";
import { getUserId } from "$src/lib/server/dbHelpers";
import { handleError } from "$src/lib/server/error";
import type { PageExercisesData } from "./types";
import type { HttpError } from "@sveltejs/kit";
import categoriesExercisesPromise from "$src/lib/server/dbCategoriesExercisesPromise";

export async function load({ locals }): Promise<PageExercisesData | HttpError> {
	try {
		const userId = await getUserId(locals);

		const unitsPromise = db.select({ id: unit.id, name: unit.name }).from(unit);

		// todo dokoncit query
		const categoriesPromise = categoriesExercisesPromise(userId);

		const [units, categories] = await Promise.all([unitsPromise, categoriesPromise]);

		return {
			units,
			categories,
		};
	} catch (error) {
		throw handleError(error);
	}
}
