import { DATABASE_URL } from "$env/static/private";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { drizzle as neonDrizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";

import { neon, neonConfig } from "@neondatabase/serverless";
// import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { sql } from "drizzle-orm";

// @ts-ignore
let db: PostgresJsDatabase | NeonHttpDatabase = global.db;
neonConfig.fetchConnectionCache = true;

if (!db) {
	if (import.meta.env.MODE === "development") {
		const queryClient = postgres(DATABASE_URL, { max: 1 });
		db = drizzle(queryClient);
		// @ts-ignore
		global.db = db;
	} else {
		const sql = neon(DATABASE_URL);
		db = neonDrizzle(sql);
	}
}

try {
	const res = await db.execute(sql`select version()`);
	console.log(res);
} finally {
}

export default db;
