import { workout } from "$src/db/schema/workout.js";
import db from "$src/lib/server/db.js";
import { getUserId } from "$src/lib/server/dbHelpers";
import dbPlannedWorkouts, { dbInsertCompleteWorkout } from "$src/lib/server/dbPlannedWorkouts";
import { parseFilledWorkout } from "$src/lib/server/dbSchemaValidation";
import { handleError } from "$src/lib/server/error";
import type { PageInsertFillWorkout } from "$src/routes/workouts/types.js";
import { json } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";

// export async function DELETE({ params, locals }) {
// 	try {
// 		const userId = await getUserId(locals);

// 		await db.delete(workout).where(and(eq(workout.id, parseInt(params.slug)), eq(workout.userId, userId)));

// 		return json((await dbPlannedWorkouts(userId)).plannedWorkouts);
// 	} catch (error) {
// 		const errorResponse = handleError(error);
// 		return new Response(errorResponse.body.message, { status: errorResponse.status });
// 	}
// }

// possible optimazation: only update the things that changed
export async function PUT({ params, locals, request }) {
	try {
		const userId = await getUserId(locals);

		const workoutChanges = await db.transaction(async (transaction) => {
			await transaction
				.delete(workout)
				.where(and(eq(workout.id, parseInt(params.slug)), eq(workout.userId, userId)));

			const parsedWorkout: PageInsertFillWorkout = parseFilledWorkout(await request.json());

			await dbInsertCompleteWorkout(userId, parsedWorkout, transaction);
			const workouts = await dbPlannedWorkouts(userId, transaction);

			return workouts;
		});

		return json(workoutChanges);
	} catch (error) {
		const errorResponse = handleError(error);
		return new Response(errorResponse.body.message, { status: errorResponse.status });
	}
}
