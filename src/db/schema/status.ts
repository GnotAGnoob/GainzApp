import { relations } from "drizzle-orm";
import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { workout } from "./workout";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";

export const status = pgTable("status", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 32 }).notNull().unique(),

	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const statusRelations = relations(status, ({ many }) => ({
	workouts: many(workout),
}));

export type Status = InferSelectModel<typeof status>;
export type InsertStatus = InferInsertModel<typeof status>;
