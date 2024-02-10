import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

// @ts-ignore would be better if it would take the variable from the config
const migrationClient = postgres(process.env.DATABASE_URL, { max: 1 });

try {
	await migrate(drizzle(migrationClient), { migrationsFolder: "drizzle" });
	// eslint-disable-next-line no-console
	console.info("Migration script complete");
} catch (error) {
	throw new Error(`Migration failed: ${error}`);
}
