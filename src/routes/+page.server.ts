import { getUserId } from "$src/lib/server/dbHelpers";
import { handleError } from "$src/lib/server/error";
import dbPlannedWorkouts from "$src/lib/server/dbWorkouts";

export async function load({ locals, isDataRequest }) {
	try {
		const userId = await getUserId(locals);
		return { streamed: isDataRequest ? dbPlannedWorkouts(userId) : await dbPlannedWorkouts(userId) };
	} catch (error) {
		throw handleError(error);
	}
}
