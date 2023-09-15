import { pgTable, serial, text, timestamp, unique, varchar } from "drizzle-orm/pg-core";
import { user } from "./user";
import { relations } from "drizzle-orm";
import { exercise } from "./exercise";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { MAX_TEXT_LENGTH } from "../../lib/constants";
import type { dbQueryOmit } from "$src/lib/server/dbHelpers";

export const category = pgTable(
	"category",
	{
		id: serial("id").primaryKey(),
		name: varchar("name", { length: MAX_TEXT_LENGTH }).notNull(),

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

export type Category = Omit<InferSelectModel<typeof category>, keyof typeof dbQueryOmit>;
export type InsertCategory = InferInsertModel<typeof category>;

export const categoryInsertValidator = createInsertSchema(category);
export const categorySelectValidator = createSelectSchema(category);
