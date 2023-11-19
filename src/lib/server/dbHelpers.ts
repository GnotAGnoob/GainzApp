import { user } from "$src/db/schema/user";
import { eq } from "drizzle-orm";
import db from "./db";
import { error } from "@sveltejs/kit";

export const getUserId = async (locals: App.Locals) => {
	const session = await locals.getSession();

	if (!session?.user?.email) {
		throw error(401, "Unauthorized");
	}

	const users = await db.select({ id: user.id }).from(user).where(eq(user.email, session.user.email));
	const userId = users[0].id;

	if (!userId) {
		throw error(401, "Unauthorized");
	}

	return userId;
};

export const dbQueryOmit = {
	userId: false,
	createdAt: false,
	updatedAt: false,
	categoryId: false,
	unitId: false,
	statusId: false,
	workoutId: false,
	exerciseId: false,
	supersetId: false,
	supersetExerciseId: false,
	order: false,
} as const;

export const dbInsertQueryOmit = {
	...dbQueryOmit,
	id: false,
} as const;
