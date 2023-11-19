import { integer, pgTable, serial, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { supersetExercise } from "./supersetExercise";
import type { dbInsertQueryOmit, dbQueryOmit } from "$src/lib/server/dbHelpers";

export const setWeight = pgTable("setWeight", {
	id: serial("id").primaryKey(),
	repetition: integer("repetition").notNull(),
	weight: integer("weight").notNull(),

	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),

	supersetExerciseId: integer("superset_exercise_id")
		.references(() => supersetExercise.id, { onDelete: "cascade" })
		.notNull(),
});

export const setRelations = relations(setWeight, ({ one }) => ({
	supersetExercise: one(supersetExercise, {
		fields: [setWeight.supersetExerciseId],
		references: [supersetExercise.id],
	}),
}));

export type SetWeight = Omit<InferSelectModel<typeof setWeight>, keyof typeof dbQueryOmit>;
export type InsertSetWeight = Omit<InferInsertModel<typeof setWeight>, keyof typeof dbInsertQueryOmit>;

export const setInsertValidator = createInsertSchema(setWeight);
export const setSelectValidator = createSelectSchema(setWeight);
