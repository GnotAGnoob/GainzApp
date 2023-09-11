import { category } from "$src/db/schema/category.js";
import { MAX_TEXT_LENGTH } from "$src/lib/constants";
import db from "$src/lib/server/db";
import { z } from "zod";
import { user } from "$src/db/schema/user";
import { eq } from "drizzle-orm";
import { exercise } from "$src/db/schema/exercise.js";

export async function POST({ request, locals }) {
	try {
		const session = await locals.getSession();

		if (!session?.user?.email) {
			return new Response("Unauthorized", { status: 401 });
		}

		const users = await db.select({ id: user.id }).from(user).where(eq(user.email, session.user.email));
		const userId = users[0].id;

		if (!userId) {
			return new Response("Unauthorized", { status: 401 });
		}

		const schema = z.array(
			z.object({
				name: z.string().max(MAX_TEXT_LENGTH),
				category: z.string().max(MAX_TEXT_LENGTH),
				unit: z.string().max(MAX_TEXT_LENGTH),
			}),
		);

		const exercises = schema.parse(await request.json());

		// todo unit a category s dropdown s tlacitkem na pridani viz gmail s tabama
		const categoriesSet = new Set(exercises.map((exercise) => exercise.category));
		const categories = [...categoriesSet].map((categoryName) => ({
			name: categoryName,
			userId,
		}));

		await db.transaction(async (transaction) => {
			await transaction.insert(category).values(categories).onConflictDoNothing();
			await transaction.insert(exercise).values(
				exercises.map((exercise) => ({
					name: exercise.name,
					categoryId: 7,
					unitId: 1,
				})),
			);
		});

		return new Response();
		// await db.insert
	} catch (error) {
		// eslint-disable-next-line no-console
		console.log(error);

		if (error instanceof z.ZodError) {
			return new Response(error.message, { status: 422 });
		}

		return new Response("Unknown error", { status: 500 });
	}
}
