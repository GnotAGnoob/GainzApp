import type schema from "$src/db/schema";
import type { NeonDatabase } from "drizzle-orm/neon-serverless";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

export type Database = PostgresJsDatabase<typeof schema> | NeonDatabase<typeof schema>;

export type StatusId = "planned" | "done" | "template";
