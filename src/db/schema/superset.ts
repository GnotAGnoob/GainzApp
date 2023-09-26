import { integer, pgTable, serial, timestamp } from "drizzle-orm/pg-core";
import { workout } from "./workout";
import { relations } from "drizzle-orm";
import { supersetExercise } from "./supersetExercise";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const superset = pgTable("superset", {
	id: serial("id").primaryKey(),
	order: integer("order").notNull(),

	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),

	workoutId: integer("workout_id")
		.references(() => workout.id, { onDelete: "cascade" })
		.notNull(),
});

export const supersetRelations = relations(superset, ({ one, many }) => ({
	workout: one(workout, {
		fields: [superset.workoutId],
		references: [workout.id],
	}),

	supersetExercise: many(supersetExercise),
}));

export type Superset = InferSelectModel<typeof superset>;
export type InsertSuperset = InferInsertModel<typeof superset>;

export const supersetInsertValidator = createInsertSchema(superset);
export const supersetSelectValidator = createSelectSchema(superset);
