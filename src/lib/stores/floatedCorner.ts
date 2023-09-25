import { writable, type Writable } from "svelte/store";

type floatedCornerType = "addExercise" | "addWorkout";

export const floatedCorner: Writable<floatedCornerType[]> = writable([]);
