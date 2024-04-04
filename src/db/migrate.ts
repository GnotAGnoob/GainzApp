import { migrate } from "drizzle-orm/postgres-js/migrator";
import { envError } from "../lib/error";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

import schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) throw envError("DATABASE_URL");

try {
	const dbConnection = postgres(databaseUrl, { max: 1 });
	const db = drizzle(dbConnection, { schema });

	await migrate(db, { migrationsFolder: "drizzle" });
	await dbConnection.end();

	// eslint-disable-next-line no-console
	console.info("Migration script complete");
} catch (error) {
	console.error("Error during migration:", error);
	process.exit(1);
}
