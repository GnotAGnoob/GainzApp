import { writable, type Writable } from "svelte/store";

type floatedCornerType = "addExercise";

export const floatedCorner: Writable<floatedCornerType[]> = writable([]);
