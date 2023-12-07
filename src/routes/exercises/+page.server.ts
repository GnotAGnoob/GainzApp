import db from "$src/lib/server/db";
import { getUserId } from "$src/lib/server/dbHelpers";
import { handleError } from "$src/lib/server/error";
import type { PageExercisesData } from "./types";
import type { HttpError } from "@sveltejs/kit";
import dbCategoriesExercisesPromise from "$src/lib/server/dbCategoriesExercisesPromise";

export async function load({ locals }): Promise<PageExercisesData | HttpError> {
	try {
		const userId = await getUserId(locals);

		return dbCategoriesExercisesPromise(userId, db);
	} catch (error) {
		throw handleError(error);
	}
}
