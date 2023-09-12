import { DATABASE_URL } from "$env/static/private";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { drizzle as neonDrizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import { neon, neonConfig } from "@neondatabase/serverless";
import postgres from "postgres";

import schema from "$db/schema";
import { envError } from "../error";

if (!DATABASE_URL) throw envError("DATABASE_URL");
// TODO Fix @ts-ignore

let db: PostgresJsDatabase<typeof schema> | NeonHttpDatabase<typeof schema>;
neonConfig.fetchConnectionCache = true;

if (import.meta.env.MODE === "development") {
	// @ts-ignore
	if (!global._db) {
		const queryClient = postgres(DATABASE_URL, { max: 1 });
		// @ts-ignore
		global._db = drizzle(queryClient, { schema });
	}
	// @ts-ignore
	db = global._db;
} else {
	const sql = neon(DATABASE_URL);
	db = neonDrizzle(sql, { schema });
}

export default db;
