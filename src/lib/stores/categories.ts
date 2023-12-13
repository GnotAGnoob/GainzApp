import type { PageCategory } from "$src/routes/exercises/types";
import { writable, type Writable } from "svelte/store";

export const categories: Writable<PageCategory[]> = writable([]);
