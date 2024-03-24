import { env } from "$env/dynamic/private";
import { drizzle } from "drizzle-orm/postgres-js";
import { drizzle as neonDrizzle } from "drizzle-orm/neon-http";
import { neon, neonConfig } from "@neondatabase/serverless";
import postgres from "postgres";

import schema from "$db/schema";
import { envError } from "../error";
import type { Database } from "./dbTypes";

if (!env.DATABASE_URL) throw envError("DATABASE_URL");

let db: Database;
neonConfig.fetchConnectionCache = true;

if (import.meta.env.MODE === "development") {
	if (!global._db) {
		const queryClient = postgres(env.DATABASE_URL, { max: 1 });
		global._db = drizzle(queryClient, { schema });
	}

	db = global._db;
} else {
	const sql = neon(env.DATABASE_URL);
	db = neonDrizzle(sql, { schema });
}

export default db;
