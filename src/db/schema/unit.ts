import { relations } from "drizzle-orm";
import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { exercise } from "./exercise";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";

export const unit = pgTable("unit", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 32 }).notNull().unique(),

	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const unitRelations = relations(unit, ({ many }) => ({
	// exercises: many(exercise),
}));

export type Unit = InferSelectModel<typeof unit>;
export type InsertUnit = InferInsertModel<typeof unit>;
