import type { PageSupersetExerciseInfo } from "$src/routes/exercises/types";
import { writable, type Writable } from "svelte/store";

export const exerciseAdditionalInfo: Writable<Map<number, Omit<PageSupersetExerciseInfo, "unit">>> = writable(
	new Map(),
);
