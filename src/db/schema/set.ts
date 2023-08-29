import { integer, pgTable, serial, timestamp } from "drizzle-orm/pg-core";
import { exercise } from "./exercise";
import { superset } from "./superset";
import { relations } from "drizzle-orm";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";

export const set = pgTable("set", {
	id: serial("id").primaryKey(),
	repetition: integer("repetition"),
	weight: integer("weight"),

	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),

	exerciseID: integer("exercise_id")
		.references(() => exercise.id, { onDelete: "cascade" })
		.notNull(),
	supersetID: integer("superset_id")
		.references(() => superset.id, { onDelete: "cascade" })
		.notNull(),
});

export const exerciseRelations = relations(set, ({ one }) => ({
	exercise: one(exercise, {
		fields: [set.exerciseID],
		references: [exercise.id],
	}),
	superset: one(superset, {
		fields: [set.supersetID],
		references: [superset.id],
	}),
}));

export type Set = InferSelectModel<typeof set>;
export type InsertSet = InferInsertModel<typeof set>;
