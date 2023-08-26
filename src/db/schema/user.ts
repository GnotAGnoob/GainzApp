import { relations } from "drizzle-orm";
import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { category } from "./category";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";

export const user = pgTable("user", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 64 }),
	email: varchar("name", { length: 64 }).notNull().unique(),
	image: varchar("name", { length: 64 }),

	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const userRelations = relations(user, ({ many }) => ({
	categories: many(category),
}));

export type User = InferSelectModel<typeof user>;
export type InsertUser = InferInsertModel<typeof user>;
