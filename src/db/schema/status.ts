import { relations } from "drizzle-orm";
import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { workout } from "./workout";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { MAX_TEXT_LENGTH } from "../../lib/constants";

export const status = pgTable("status", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: MAX_TEXT_LENGTH }).notNull().unique(),

	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const statusRelations = relations(status, ({ many }) => ({
	workouts: many(workout),
}));

export type Status = InferSelectModel<typeof status>;
export type InsertStatus = InferInsertModel<typeof status>;

export const statusInsertValidator = createInsertSchema(status);
export const statusSelectValidator = createSelectSchema(status);

export const STATUS = {
	planned: "planned",
	done: "done",
	template: "template",
} as const;
