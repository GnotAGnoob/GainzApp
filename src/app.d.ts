import type { PageExercisesData } from "./routes/exercises/types";

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
}

export {};
