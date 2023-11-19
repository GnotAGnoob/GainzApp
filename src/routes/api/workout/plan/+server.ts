import { getUserId } from "$src/lib/server/dbHelpers";
import { json } from "@sveltejs/kit";
import { handleError } from "$src/lib/server/error";
import { parseCreateWorkout } from "$src/lib/server/dbSchemaValidation.js";
import { dbPostPlannedWorkoutPromise } from "$src/lib/server/dbPlannedWorkouts.js";

export async function POST({ request, locals }) {
	try {
		const userId = await getUserId(locals);
		const insertedWorkout = await dbPostPlannedWorkoutPromise(userId, parseCreateWorkout(await request.json()));

		return json(insertedWorkout);
	} catch (error) {
		const errorResponse = handleError(error);
		return new Response(errorResponse.body.message, { status: errorResponse.status });
	}
}
