import type { PageCategory } from "$src/routes/exercises/types";
import { writable, type Writable, derived } from "svelte/store";

export const categories: Writable<PageCategory[]> = writable([]);
export const sortedCategories = derived(categories, ($categories) =>
	$categories.sort((a, b) => a.name.localeCompare(b.name, "en")),
);
