import type { PageExercisesData } from "./routes/exercises/types";
import { type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { type NeonDatabase } from "drizzle-orm/neon-serverless";

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
			_db: PostgresJsDatabase<typeof schema> | NeonDatabase<typeof schema> | undefined;
		}
	}
}

export {};
