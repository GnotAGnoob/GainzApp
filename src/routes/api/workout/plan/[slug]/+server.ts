import { workout } from "$src/db/schema/workout.js";
import db from "$src/lib/server/db.js";
import { getUserId } from "$src/lib/server/dbHelpers";
import { dbGetWorkoutsPromise, dbPostPlannedWorkoutPromise } from "$src/lib/server/dbWorkouts.js";
import { parseCreateWorkout } from "$src/lib/server/dbSchemaValidation";
import { handleError } from "$src/lib/server/error";
import type { PageInsertPlanWorkout, PagePlannedWorkout } from "$src/routes/workouts/types.js";
import { error, json } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";
import { STATUS } from "$src/db/schema/status";

export async function DELETE({ params, locals }) {
	try {
		const userId = await getUserId(locals);

		await db.delete(workout).where(and(eq(workout.id, parseInt(params.slug)), eq(workout.userId, userId)));

		return json(await dbGetWorkoutsPromise(userId, STATUS.planned, db));
	} catch (error) {
		const errorResponse = handleError(error);
		return new Response(errorResponse.body.message, { status: errorResponse.status });
	}
}

// possible optimazation: only update the things that changed
export async function PUT({ params, locals, request }) {
	try {
		const userId = await getUserId(locals);

		const plannedWorkout: PagePlannedWorkout = await db.transaction(async (transaction) => {
			const deletedWorkout = await transaction
				.delete(workout)
				.where(and(eq(workout.id, parseInt(params.slug)), eq(workout.userId, userId)))
				.returning();

			const parsedWorkout: PageInsertPlanWorkout = parseCreateWorkout(await request.json());
			parsedWorkout.order = deletedWorkout[0].order || undefined;

			if (!parsedWorkout.order) {
				throw error(404, "Workout order not found");
			}

			const insertedWorkout = await dbPostPlannedWorkoutPromise(userId, parsedWorkout, transaction);

			return insertedWorkout;
		});

		return json(plannedWorkout);
	} catch (error) {
		const errorResponse = handleError(error);
		return new Response(errorResponse.body.message, { status: errorResponse.status });
	}
}
