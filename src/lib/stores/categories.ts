import type { Category } from "$src/db/schema/category";
import { writable, type Writable } from "svelte/store";

interface ICategory extends Omit<Category, "userId" | "createdAt" | "updatedAt"> {
	//todo proper type

	exercises: any[];
}

export const categories: Writable<ICategory[]> = writable([]);
