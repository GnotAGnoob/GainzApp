import { getUserId } from "$src/lib/server/dbHelpers";
import { handleError } from "$src/lib/server/error";
import type { PagePlannedWorkouts } from "./types";
import type { HttpError } from "@sveltejs/kit";
import dbPlannedWorkouts from "$src/lib/server/dbWorkouts";

export async function load({ locals }): Promise<PagePlannedWorkouts | HttpError> {
	try {
		const userId = await getUserId(locals);

		return await dbPlannedWorkouts(userId);
	} catch (error) {
		throw handleError(error);
	}
}
