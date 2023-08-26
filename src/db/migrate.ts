/* eslint-disable no-console */
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

// @ts-ignore would be better if it would take the variable from the config
const migrationClient = postgres(process.env.DATABASE_URL, { max: 1 });
migrate(drizzle(migrationClient), { migrationsFolder: "drizzle" });
console.log("Migration script complete");
