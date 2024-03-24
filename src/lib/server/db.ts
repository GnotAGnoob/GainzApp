import { env } from "$env/dynamic/private";
import { drizzle } from "drizzle-orm/postgres-js";
import { drizzle as neonDrizzle } from "drizzle-orm/neon-http";
import { neon, neonConfig } from "@neondatabase/serverless";
import postgres from "postgres";

import schema from "$db/schema";
import { envError } from "../error";
import type { Database } from "./dbTypes";

let db: Database;

if (!env.DATABASE_URL) throw envError("DATABASE_URL");

neonConfig.fetchConnectionCache = true;

if (!global._db) {
	if (import.meta.env.MODE === "development") {
		const queryClient = postgres(env.DATABASE_URL, { max: 1 });
		global._db = drizzle(queryClient, { schema });
	} else {
		const sql = neon(env.DATABASE_URL);
		global._db = neonDrizzle(sql, { schema });
	}
}
db = global._db;

export default db;
