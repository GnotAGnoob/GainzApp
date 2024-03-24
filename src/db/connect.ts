import { drizzle } from "drizzle-orm/postgres-js";
import { drizzle as neonDrizzle } from "drizzle-orm/neon-http";
import { neon, neonConfig } from "@neondatabase/serverless";
import postgres from "postgres";

import schema from "./schema";

neonConfig.fetchConnectionCache = true;

export const connectDbDev = (databaseUrl: string) => {
	const dbConnection = postgres(databaseUrl, { max: 1 });
	const db = drizzle(dbConnection, { schema });

	return { db, dbConnection };
};

export const connectDbProduction = (databaseUrl: string) => {
	const dbConnection = neon(databaseUrl);
	const db = neonDrizzle(dbConnection, { schema });

	return { db, dbConnection };
};
