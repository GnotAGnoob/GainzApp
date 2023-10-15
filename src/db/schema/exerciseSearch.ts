// import { integer, pgMaterializedView, serial, text, varchar } from "drizzle-orm/pg-core";
// import { category } from "./category";
// import { exercise } from "./exercise";
// import { MAX_TEXT_LENGTH } from "../../lib/constants";
// import { getTableColumns } from "drizzle-orm";
// import { eq } from "drizzle-orm";

// not implemented yet
// export const exerciseSearch = pgMaterializedView("exerciseSearch").as((queryBuilder) =>
// 	queryBuilder
// 		.select({
// 			category: category.name,
// 			name: exercise.name,
// 			userId: category.userId,
// 		})
// 		.from(category)
// 		.fullJoin(exercise, eq(category.id, exercise.categoryId)),
// );

// export const exerciseSearch = pgMaterializedView("category_exercise_search", {
// 	categoryId: integer("category_id"),
// 	category: varchar("name", { length: MAX_TEXT_LENGTH }),
// 	exerciseId: integer("exercise_id"),
// 	name: varchar("name", { length: MAX_TEXT_LENGTH }),
// 	userId: text("userId"),
// }).existing();
