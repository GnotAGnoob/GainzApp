import { relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { category } from "./category";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { workout } from "./workout";

export const user = pgTable("user", {
	id: text("id").notNull().primaryKey(),
	name: text("name"),
	email: text("email").notNull().unique(),
	emailVerified: timestamp("emailVerified", { mode: "date" }),
	image: text("image"),

	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const userRelations = relations(user, ({ many }) => ({
	categories: many(category),
	workouts: many(workout),
}));

export type User = InferSelectModel<typeof user>;
export type InsertUser = InferInsertModel<typeof user>;

export const userInsertValidator = createInsertSchema(user);
export const userSelectValidator = createSelectSchema(user);
