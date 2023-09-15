import type { load } from "$src/routes/+page.server";
import type { HomePageData } from "./routes/exercises/types";

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// todo think about if this is the best aproach
		// eslint-disable-next-line @typescript-eslint/no-empty-interface

		// eslint-disable-next-line @typescript-eslint/no-empty-interface
		interface PageData extends Partial<HomePageData> {}
		// interface Platform {}
	}
}

export {};
