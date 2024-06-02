import db from "$src/lib/server/db";
import { getUserId } from "$src/lib/server/dbHelpers";
import { handleError } from "$src/lib/server/error";
import dbCategoriesExercisesPromise from "$src/lib/server/dbCategoriesExercisesPromise";

export async function load({ locals, isDataRequest }) {
	try {
		const userId = await getUserId(locals);
		return {
			streamed: isDataRequest
				? dbCategoriesExercisesPromise(userId, db)
				: await dbCategoriesExercisesPromise(userId, db),
		};
	} catch (error) {
		throw handleError(error);
	}
}
