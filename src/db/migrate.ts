import { migrate } from "drizzle-orm/postgres-js/migrator";
import { migrate as neonMigrate } from "drizzle-orm/neon-http/migrator";
import { envError } from "../lib/error";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { drizzle as neonDrizzle } from "drizzle-orm/neon-http";
import { neon, neonConfig } from "@neondatabase/serverless";

import schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) throw envError("DATABASE_URL");

neonConfig.fetchConnectionCache = true;

try {
	const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === "development";

	if (isDev) {
		const dbConnection = postgres(databaseUrl, { max: 1 });
		const db = drizzle(dbConnection, { schema });

		await migrate(db, { migrationsFolder: "drizzle" });
		await dbConnection.end();
	} else {
		const dbConnection = neon(databaseUrl);
		const db = neonDrizzle(dbConnection, { schema });

		await neonMigrate(db, { migrationsFolder: "drizzle" });
	}

	// eslint-disable-next-line no-console
	console.info("Migration script complete");
} catch (error) {
	console.error("Error during migration:", error);
	process.exit(1);
}
