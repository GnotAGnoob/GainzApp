import { integer, pgTable, serial, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { supersetExercise } from "./supersetExercise";

export const setWeight = pgTable("setWeight", {
	id: serial("id").primaryKey(),
	repetition: integer("repetition"),
	weight: integer("weight"),

	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),

	supersetExerciseID: integer("superset_exercise_id")
		.references(() => supersetExercise.id, { onDelete: "cascade" })
		.notNull(),
});

export const setRelations = relations(setWeight, ({ one }) => ({
	supersetExercise: one(supersetExercise, {
		fields: [setWeight.supersetExerciseID],
		references: [supersetExercise.id],
	}),
}));

export type SetWeight = InferSelectModel<typeof setWeight>;
export type InsertSetWeight = InferInsertModel<typeof setWeight>;

export const setInsertValidator = createInsertSchema(setWeight);
export const setSelectValidator = createSelectSchema(setWeight);
