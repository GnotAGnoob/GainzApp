import { pgTable, serial, text, timestamp, unique, varchar } from "drizzle-orm/pg-core";
import { user } from "./user";
import { relations } from "drizzle-orm";
import { exercise } from "./exercise";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";

export const category = pgTable(
	"category",
	{
		id: serial("id").primaryKey(),
		name: varchar("name", { length: 32 }).notNull(),

		createdAt: timestamp("created_at").notNull().defaultNow(),
		// TODO Trigger na update on update u vsech
		updatedAt: timestamp("updated_at").notNull().defaultNow(),

		userId: text("userId")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
	},
	// user cannot have two categories with the same name
	(table) => ({
		unique: unique().on(table.name, table.userId),
	}),
);

export const categoryRelations = relations(category, ({ one, many }) => ({
	user: one(user, {
		fields: [category.userId],
		references: [user.id],
	}),
	exercises: many(exercise),
}));

export type Category = InferSelectModel<typeof category>;
export type InsertCategory = InferInsertModel<typeof category>;
