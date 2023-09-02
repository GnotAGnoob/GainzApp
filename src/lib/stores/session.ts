import type { Session } from "@auth/core/types";
import { writable, type Writable } from "svelte/store";

export const session: Writable<Session | null> = writable(null);
