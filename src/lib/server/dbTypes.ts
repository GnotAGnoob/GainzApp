import type schema from "$src/db/schema";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

export type Database = PostgresJsDatabase<typeof schema> | NeonHttpDatabase<typeof schema>;
