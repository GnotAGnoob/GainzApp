import { category } from "$src/db/schema/category.js";
import { MAX_TEXT_LENGTH } from "$src/lib/constants";
import db from "$src/lib/server/db";
import { z } from "zod";
import { status } from "$src/db/schema/status.js";
import { handleError } from "$src/lib/server/error";
import { dbQueryOmit, getUserId } from "$src/lib/server/dbHelpers";
import { eq, inArray } from "drizzle-orm";
import type { PageCategory } from "$src/routes/exercises/types.js";
import { json } from "@sveltejs/kit";
import { workout } from "$src/db/schema/workout";
import { superset } from "$src/db/schema/superset";
import { supersetExercise } from "$src/db/schema/supersetExercise.js";

export async function POST({ request, locals }) {
	try {
		const userId = await getUserId(locals);

		if (userId instanceof Response) {
			return userId;
		}

		const schema = z.object({
			supersets: z.array(
				z.object({
					exercises: z.array(
						z.object({
							category: z.object({
								id: z.number(),
								name: z.string().max(MAX_TEXT_LENGTH),
							}),
							exercise: z.object({
								id: z.number(),
								name: z.string().max(MAX_TEXT_LENGTH),
							}),
						}),
					),
				}),
			),
		});

		const parsedWorkout = schema.parse(await request.json());

		// // todo unit a category s dropdown s tlacitkem na pridani viz gmail s tabama
		// const categoriesSet = new Set<string>();
		// const unitSet = new Set<string>();

		// exercises.forEach((exercise) => {
		// 	categoriesSet.add(exercise.category);
		// 	unitSet.add(exercise.unit);
		// });
		// const categories = [...categoriesSet].map((categoryName) => ({
		// 	name: categoryName,
		// 	userId,
		// }));

		// let returnCategories: PageCategory[] = [];

		await db.transaction(async (transaction) => {
			const statusId = await transaction.query.status.findFirst({
				columns: {
					id: true,
				},
				where: eq(status.name, "planned"),
			});
			const workoutId = await transaction
				.insert(workout)
				.values({
					userId,
					statusId: statusId?.id || -1,
				})
				// @ts-ignore
				.returning();

			const supersetsIds = await transaction
				.insert(superset)
				.values(
					parsedWorkout.supersets.map(() => ({
						workoutId: workoutId[0].id,
					})),
				)
				.returning();

			const supersetExercises = parsedWorkout.supersets.map((superset, supersetIndex) => {
				return superset.exercises.map((activity) => ({
					exerciseId: activity.exercise.id,
					supersetId: supersetsIds[supersetIndex].id,
				}));
			});

			await transaction.insert(supersetExercise).values(supersetExercises.flat());
		});

		// const unitsPromise = transaction.query.unit.findMany({
		// 	columns: dbQueryOmit,
		// 	// eslint-disable-next-line @typescript-eslint/no-unused-vars
		// 	where: (table, _) => inArray(table.name, [...unitSet]),
		// });
		// const categoriesPromise = transaction.query.category.findMany({
		// 	columns: dbQueryOmit,
		// 	// eslint-disable-next-line @typescript-eslint/no-unused-vars
		// 	where: (table, { and }) => and(inArray(table.name, [...categoriesSet]), eq(table.userId, userId)),
		// });

		// const [unitsReturned, categoriesReturned] = await Promise.all([unitsPromise, categoriesPromise]);

		// const insertExercises = exercises.map((exercise) => ({
		// 	name: exercise.name,
		// 	unitId: unitsReturned.find((unit) => unit.name === exercise.unit)?.id as number,
		// 	categoryId: categoriesReturned.find((category) => category.name === exercise.category)?.id as number,
		// }));

		// await transaction.insert(exercise).values(insertExercises);

		// // maybe this is better
		// // const returnedExercises = await transaction.execute(sql`
		// // INSERT INTO exercise (name, unit_id, category_id)
		// // SELECT
		// // 	e.name AS name, unit.id AS unit_id, category.id AS category_id
		// // FROM
		// // 	(VALUES
		// // 		('test', 'kg', 'biceps')
		// // 	) AS e(name, unit_name, category_name)
		// // JOIN
		// // 	unit ON e.unit_name = unit.name
		// // JOIN
		// // 	category ON e.category_name = category.name
		// // WHERE
		// // 	"userId" = ${userId}
		// // RETURNING name, unit_id, category_id`);
		// });

		// return json(returnCategories);
		return new Response("ok");
	} catch (error) {}
}

// on update update workout set "order" = 1 where id = 9;
