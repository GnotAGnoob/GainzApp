import db from "$src/lib/server/db";
import { eq, isNull, or, sql } from "drizzle-orm";
import { dbQueryOmit } from "./dbHelpers";
import { category } from "$src/db/schema/category";
import { exercise } from "$src/db/schema/exercise";
import type { Database } from "./dbTypes";

export default (userId: string, database?: Database) => {
	const databaseConnection = database || db;
	return databaseConnection.query.category.findMany({
		columns: dbQueryOmit,
		where: or(eq(category.userId, userId), isNull(category.userId)),
		with: {
			exercises: {
				columns: { ...dbQueryOmit },
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
};
