import { migrate } from "drizzle-orm/postgres-js/migrator";
import { migrate as neonMigrate } from "drizzle-orm/neon-http/migrator";
import { connectDbDev, connectDbProduction } from "./connect";
import { envError } from "../lib/error";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) throw envError("DATABASE_URL");

try {
	const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === "development";
	if (isDev) {
		const dbClient = connectDbDev(databaseUrl);
		await migrate(dbClient.db, { migrationsFolder: "drizzle" });
		await dbClient.dbConnection.end();
	} else {
		const dbClient = connectDbProduction(databaseUrl);
		await neonMigrate(dbClient.db, { migrationsFolder: "drizzle" });
	}
	// eslint-disable-next-line no-console
	console.info("Migration script complete");
} catch (error) {
	console.error("Error during migration:", error);
	process.exit(1);
}
