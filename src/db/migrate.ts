import { migrate } from "drizzle-orm/postgres-js/migrator";
import { migrate as neonMigrate } from "drizzle-orm/neon-http/migrator";
import { connectDbDev, connectDbProduction } from "./connect";
import { envError } from "../lib/error";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) throw envError("DATABASE_URL");

let dbClient;

try {
	const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === "development";
	if (isDev) {
		dbClient = connectDbDev(databaseUrl);
		await migrate(dbClient.db, { migrationsFolder: "drizzle" });
	} else {
		dbClient = connectDbProduction(databaseUrl);
		await neonMigrate(dbClient.db, { migrationsFolder: "drizzle" });
	}
	// eslint-disable-next-line no-console
	console.info("Migration script complete");
} catch (error) {
	throw new Error(`Migration failed: ${error}`);
}

// @ts-ignore
await dbClient.dbConnection.end();
