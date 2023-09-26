import { integer, pgTable, serial, timestamp } from "drizzle-orm/pg-core";
import { exercise } from "./exercise";
import { superset } from "./superset";
import { relations } from "drizzle-orm";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { setWeight } from "./setWeight";

export const supersetExercise = pgTable("supersetExercise", {
	id: serial("id").primaryKey(),
	order: integer("order").notNull(),

	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),

	exerciseID: integer("exercise_id")
		.references(() => exercise.id, { onDelete: "cascade" })
		.notNull(),
	supersetID: integer("superset_id")
		.references(() => superset.id, { onDelete: "cascade" })
		.notNull(),
});

export const setRelations = relations(supersetExercise, ({ one, many }) => ({
	exercise: one(exercise, {
		fields: [supersetExercise.exerciseID],
		references: [exercise.id],
	}),
	superset: one(superset, {
		fields: [supersetExercise.supersetID],
		references: [superset.id],
	}),

	sets: many(setWeight),
}));

export type SupersetExercise = InferSelectModel<typeof supersetExercise>;
export type InsertSupersetExercise = InferInsertModel<typeof supersetExercise>;

export const supersetExerciseInsertValidator = createInsertSchema(supersetExercise);
export const supersetExerciseSelectValidator = createSelectSchema(supersetExercise);
