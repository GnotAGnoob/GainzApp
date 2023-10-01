import type { PagePlannedWorkout } from "$src/routes/workouts/types";
import { writable, type Writable } from "svelte/store";

export const plannedWorkouts: Writable<PagePlannedWorkout[]> = writable([]);
