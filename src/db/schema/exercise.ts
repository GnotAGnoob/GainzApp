import { integer, pgTable, serial, timestamp, unique, varchar } from "drizzle-orm/pg-core";
import { category } from "./category";
import { relations } from "drizzle-orm";
import { unit } from "./unit";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { MAX_TEXT_LENGTH } from "../../lib/constants";
import type { dbQueryOmit } from "$src/lib/server/dbHelpers";
import { supersetExercise } from "./supersetExercise";

export const exercise = pgTable(
	"exercise",
	{
		id: serial("id").primaryKey(),
		name: varchar("name", { length: MAX_TEXT_LENGTH }).notNull(),

		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at").notNull().defaultNow(),

		categoryId: integer("category_id")
			.references(() => category.id, { onDelete: "cascade" })
			.notNull(),
		unitId: integer("unit_id")
			.references(() => unit.id)
			.notNull(),
	},
	// user cannot have two categories with the same name
	(table) => ({
		unique: unique().on(table.name, table.categoryId),
	}),
);

export const exerciseRelations = relations(exercise, ({ one, many }) => ({
	category: one(category, {
		fields: [exercise.categoryId],
		references: [category.id],
	}),
	unit: one(unit, {
		fields: [exercise.unitId],
		references: [unit.id],
	}),
	supersetExercise: many(supersetExercise),
}));

export type Exercise = Omit<InferSelectModel<typeof exercise>, keyof typeof dbQueryOmit>;
export type InsertExercise = InferInsertModel<typeof exercise>;

export const exerciseInsertValidator = createInsertSchema(exercise);
export const exerciseSelectValidator = createSelectSchema(exercise);
