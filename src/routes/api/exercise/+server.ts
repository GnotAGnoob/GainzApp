import { category } from "$src/db/schema/category.js";
import { MAX_TEXT_LENGTH } from "$src/lib/constants";
import db from "$src/lib/server/db";
import { z } from "zod";
import { exercise } from "$src/db/schema/exercise.js";
import { handleError } from "$src/lib/server/error";
import { dbQueryOmit, getUserId } from "$src/lib/server/dbHelpers";
import { unit } from "$src/db/schema/unit.js";
import { eq, inArray, sql } from "drizzle-orm";
import type { PageCategory } from "$src/routes/exercises/types.js";
import { json } from "@sveltejs/kit";

export async function POST({ request, locals }) {
	try {
		const userId = await getUserId(locals);

		if (userId instanceof Response) {
			return userId;
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
			await transaction.insert(category).values(categories).onConflictDoNothing();

			const unitsPromise = transaction.query.unit.findMany({
				columns: dbQueryOmit,
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				where: (table, _) => inArray(table.name, [...unitSet]),
			});
			const categoriesPromise = transaction.query.category.findMany({
				columns: dbQueryOmit,
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				where: (table, { and }) => and(inArray(table.name, [...categoriesSet]), eq(table.userId, userId)),
			});

			const [unitsReturned, categoriesReturned] = await Promise.all([unitsPromise, categoriesPromise]);

			const insertExercises = exercises.map((exercise) => ({
				name: exercise.name,
				unitId: unitsReturned.find((unit) => unit.name === exercise.unit)?.id as number,
				categoryId: categoriesReturned.find((category) => category.name === exercise.category)?.id as number,
			}));

			await transaction.insert(exercise).values(insertExercises);

			// maybe this is better
			// const returnedExercises = await transaction.execute(sql`
			// INSERT INTO exercise (name, unit_id, category_id)
			// SELECT
			// 	e.name AS name, unit.id AS unit_id, category.id AS category_id
			// FROM
			// 	(VALUES
			// 		('test', 'kg', 'biceps')
			// 	) AS e(name, unit_name, category_name)
			// JOIN
			// 	unit ON e.unit_name = unit.name
			// JOIN
			// 	category ON e.category_name = category.name
			// WHERE
			// 	"userId" = ${userId}
			// RETURNING name, unit_id, category_id`);

			// could be optimized with where clause
			returnCategories = await transaction.query.category.findMany({
				columns: dbQueryOmit,
				with: {
					exercises: {
						columns: { ...dbQueryOmit },
						with: {
							unit: {
								columns: dbQueryOmit,
							},
						},
					},
				},
			});
		});

		return json(returnCategories);
	} catch (error) {
		return handleError(error);
	}
}
