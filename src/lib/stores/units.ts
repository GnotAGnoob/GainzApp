import type { Unit } from "$src/db/schema/unit";
import { writable, type Writable } from "svelte/store";

export const units: Writable<Unit[]> = writable([]);
