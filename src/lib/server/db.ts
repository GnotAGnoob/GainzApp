import { DATABASE_URL } from "$env/static/private";
import { drizzle } from "drizzle-orm/postgres-js";
import { drizzle as neonDrizzle } from "drizzle-orm/neon-http";
import { neon, neonConfig } from "@neondatabase/serverless";
import postgres from "postgres";

import schema from "$db/schema";
import { envError } from "../error";
import type { Database } from "./dbTypes";

let databaseUrl = DATABASE_URL;

if (import.meta.env.MODE === "ci") {
	databaseUrl = "postgres://ci:ci@localhost:1234/postgres";
}

if (!databaseUrl) throw envError("DATABASE_URL");

neonConfig.fetchConnectionCache = true;

if (!global._db) {
	if (import.meta.env.MODE === "development") {
		const queryClient = postgres(databaseUrl, { max: 1 });
		global._db = drizzle(queryClient, { schema });
	} else {
		const sql = neon(databaseUrl);
		global._db = neonDrizzle(sql, { schema });
	}
}

const db: Database = global._db;

export default db;
