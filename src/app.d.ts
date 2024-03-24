import type { PageExercisesData } from "./routes/exercises/types";
import { type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { type NeonHttpDatabase } from "drizzle-orm/neon-http";

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}

		// eslint-disable-next-line @typescript-eslint/no-empty-interface
		interface PageData extends Partial<PageExercisesData> {}
		// interface Platform {}
	}

	namespace NodeJS {
		interface Global {
			_db: PostgresJsDatabase<typeof schema> | NeonHttpDatabase<typeof schema> | undefined;
			_dbConnection: any;
		}
	}
}

export {};
