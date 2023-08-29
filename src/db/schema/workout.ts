import { integer, pgTable, serial, text, timestamp, unique } from "drizzle-orm/pg-core";
import { user } from "./user";
import { status } from "./status";
import { relations } from "drizzle-orm";
import { superset } from "./superset";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";

export const workout = pgTable(
	"workout",
	{
		id: serial("id").primaryKey(),
		date: timestamp("date").notNull().defaultNow(),
		order: integer("order"),

		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at").notNull().defaultNow(),

		userId: text("userId")
			.references(() => user.id, { onDelete: "cascade" })
			.notNull(),
		statusId: integer("status_id")
			.references(() => status.id)
			.notNull(),
		// todo: add check for order
	},
	(table) => ({
		unique: unique().on(table.order, table.userId),
	}),
);

export const exerciseRelations = relations(workout, ({ many, one }) => ({
	user: one(user, {
		fields: [workout.userId],
		references: [user.id],
	}),
	status: one(status, {
		fields: [workout.statusId],
		references: [status.id],
	}),

	supersets: many(superset),
}));

export type Workout = InferSelectModel<typeof workout>;
export type InsertWorkout = InferInsertModel<typeof workout>;
