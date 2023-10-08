import { category } from "$src/db/schema/category";
import { unit } from "$src/db/schema/unit";
import db from "$src/lib/server/db";
import { dbQueryOmit, getUserId } from "$src/lib/server/dbHelpers";
import { handleError } from "$src/lib/server/error";
import { eq, isNull, or, sql } from "drizzle-orm";
import type { PageExercisesData } from "./types";
import type { HttpError } from "@sveltejs/kit";
import { exercise } from "$src/db/schema/exercise";

export async function load({ locals }): Promise<PageExercisesData | HttpError> {
	try {
		const userId = await getUserId(locals);

		const unitsPromise = db.select({ id: unit.id, name: unit.name }).from(unit);

		// todo dokoncit query
		const categoriesPromise = db.query.category.findMany({
			columns: dbQueryOmit,
			where: or(eq(category.userId, userId), isNull(category.userId)),
			with: {
				exercises: {
					columns: { ...dbQueryOmit, categoryId: false, unitId: false },
					where: or(eq(exercise.userId, userId), isNull(exercise.userId)),
					with: {
						unit: {
							columns: dbQueryOmit,
						},
					},
					extras: {
						isGlobal: sql<boolean>`(${exercise.userId} IS NULL)`.as("is_global"),
					},
				},
			},
			extras: {
				isGlobal: sql<boolean>`(${category.userId} IS NULL)`.as("is_global"),
			},
		});

		const [units, categories] = await Promise.all([unitsPromise, categoriesPromise]);

		return {
			units,
			categories,
		};
	} catch (error) {
		throw handleError(error);
	}
}
