import { user } from "$src/db/schema/user";
import { eq } from "drizzle-orm";
import db from "./db";

export const getUserId = async (locals: App.Locals) => {
	const session = await locals.getSession();

	if (!session?.user?.email) {
		return new Response("Unauthorized", { status: 401 });
	}

	const users = await db.select({ id: user.id }).from(user).where(eq(user.email, session.user.email));
	const userId = users[0].id;

	if (!userId) {
		return new Response("Unauthorized", { status: 401 });
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
} as const;
