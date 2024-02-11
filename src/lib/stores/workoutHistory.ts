import type { PageWorkout } from "$src/routes/types";
import { writable, type Writable } from "svelte/store";

export const workoutHistory: Writable<PageWorkout[]> = writable([]);
