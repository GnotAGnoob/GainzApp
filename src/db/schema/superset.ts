import { integer, pgTable, serial, timestamp } from "drizzle-orm/pg-core";
import { workout } from "./workout";
import { relations } from "drizzle-orm";
import { set } from "./set";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";

export const superset = pgTable("superset", {
	id: serial("id").primaryKey(),

	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),

	workoutId: integer("workout_id")
		.references(() => workout.id, { onDelete: "cascade" })
		.notNull(),
});

export const exerciseRelations = relations(superset, ({ one, many }) => ({
	workout: one(workout, {
		fields: [superset.workoutId],
		references: [workout.id],
	}),

	sets: many(set),
}));

export type Superset = InferSelectModel<typeof superset>;
export type InsertSuperset = InferInsertModel<typeof superset>;
