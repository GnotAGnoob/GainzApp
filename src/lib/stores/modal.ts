import { writable, type Writable } from "svelte/store";

type ModalStoreType = {
	closeDisabledText: string | null;
};

export const modal: Writable<ModalStoreType> = writable({
	closeDisabledText: null,
});
