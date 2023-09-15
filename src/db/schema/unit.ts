import { relations } from "drizzle-orm";
import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { exercise } from "./exercise";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { MAX_TEXT_LENGTH } from "../../lib/constants";
import type { dbQueryOmit } from "$src/lib/server/dbHelpers";

export const unit = pgTable("unit", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: MAX_TEXT_LENGTH }).notNull().unique(),

	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const unitRelations = relations(unit, ({ many }) => ({
	exercises: many(exercise),
}));

export type Unit = Omit<InferSelectModel<typeof unit>, keyof typeof dbQueryOmit>;
export type InsertUnit = InferInsertModel<typeof unit>;

export const unitInsertValidator = createInsertSchema(unit);
export const unitSelectValidator = createSelectSchema(unit);
