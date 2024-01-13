import { integer, pgTable, serial, timestamp, unique } from "drizzle-orm/pg-core";
import { exercise } from "./exercise";
import { superset } from "./superset";
import { setWeight } from "./setWeight";
import { relations } from "drizzle-orm";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const supersetExercise = pgTable(
	"supersetExercise",
	{
		id: serial("id").primaryKey(),
		order: integer("order"),

		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at").notNull().defaultNow(),

		exerciseId: integer("exercise_id").references(() => exercise.id, { onDelete: "cascade" }),
		supersetId: integer("superset_id")
			.references(() => superset.id, { onDelete: "cascade" })
			.notNull(),
	},
	(table) => ({
		unique: unique().on(table.order, table.supersetId),
	}),
);

export const supersetExerciseRelations = relations(supersetExercise, ({ one, many }) => ({
	exercise: one(exercise, {
		fields: [supersetExercise.exerciseId],
		references: [exercise.id],
		relationName: "supersetExercises",
	}),
	exercise2: one(exercise, {
		fields: [supersetExercise.exerciseId],
		references: [exercise.id],
		relationName: "bestWorkouts",
	}),
	superset: one(superset, {
		fields: [supersetExercise.supersetId],
		references: [superset.id],
	}),

	sets: many(setWeight),
}));

export type SupersetExercise = InferSelectModel<typeof supersetExercise>;
export type InsertSupersetExercise = InferInsertModel<typeof supersetExercise>;

export const supersetExerciseInsertValidator = createInsertSchema(supersetExercise);
export const supersetExerciseelectValidator = createSelectSchema(supersetExercise);
