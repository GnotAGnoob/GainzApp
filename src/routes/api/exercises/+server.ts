import { category } from "$src/db/schema/category";
import { MAX_TEXT_LENGTH } from "$src/lib/constants";
import db from "$src/lib/server/db";
import { z } from "zod";
import { exercise } from "$src/db/schema/exercise";
import { handleError } from "$src/lib/server/error";
import { dbQueryOmit, getUserId } from "$src/lib/server/dbHelpers";
import type { PageCategory } from "$src/routes/exercises/types";
import { json } from "@sveltejs/kit";
import dbCategoriesExercisesPromise from "$src/lib/server/dbCategoriesExercisesPromise.js";

export async function POST({ request, locals }) {
	try {
		const userId = await getUserId(locals);

		const schema = z.array(
			z.object({
				name: z.string().max(MAX_TEXT_LENGTH),
				category: z.string().max(MAX_TEXT_LENGTH),
				unit: z.string().max(MAX_TEXT_LENGTH),
			}),
		);

		const exercises = schema.parse(await request.json());

		const categoriesSet = new Set<string>();
		const unitSet = new Set<string>();

		exercises.forEach((exercise) => {
			categoriesSet.add(exercise.category);
			unitSet.add(exercise.unit);
		});
		const categories = [...categoriesSet].map((categoryName) => ({
			name: categoryName,
			userId,
		}));

		let returnCategories: PageCategory[] = [];

		await db.transaction(async (transaction) => {
			try {
				await transaction.transaction(async (transaction2) => {
					const allCategories = await transaction2.query.category.findMany({
						columns: dbQueryOmit,
						where: (table, { eq, or, isNull }) => or(eq(table.userId, userId), isNull(exercise.userId)),
					});

					const categoriesToInsert = categories.filter(
						(category) =>
							!allCategories.find((existingCategory) => existingCategory.name === category.name),
					);

					await transaction2.insert(category).values(categoriesToInsert).onConflictDoNothing();
				});
			} catch (error) {
				/* empty */
			}

			const unitsPromise = transaction.query.unit.findMany({
				columns: dbQueryOmit,
				where: (table, { inArray }) => inArray(table.name, [...unitSet]),
			});
			const categoriesPromise = transaction.query.category.findMany({
				columns: dbQueryOmit,
				where: (table, { and, or, isNull, inArray, eq }) =>
					and(inArray(table.name, [...categoriesSet]), or(eq(table.userId, userId), isNull(table.userId))),
			});

			const [unitsReturned, categoriesReturned] = await Promise.all([unitsPromise, categoriesPromise]);

			const insertExercises = exercises.map((exercise) => ({
				name: exercise.name,
				unitId: unitsReturned.find((unit) => unit.name === exercise.unit)?.id as number,
				categoryId: categoriesReturned.find((category) => category.name === exercise.category)?.id as number,
			}));

			await transaction.insert(exercise).values(insertExercises);

			// could be optimized with where clause
			returnCategories = await dbCategoriesExercisesPromise(userId, transaction);
		});

		return json(returnCategories);
	} catch (error) {
		const errorResponse = handleError(error);
		return new Response(errorResponse.body.message, { status: errorResponse.status });
	}
}
