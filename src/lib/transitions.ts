import { quadOut } from "svelte/easing";
import type { TransitionConfig } from "svelte/transition";

export const DEFAULT_TRANSITION_DURATION = 100;

export const DEFAULT_TRANSITION_CONFIG: TransitionConfig = {
	duration: DEFAULT_TRANSITION_DURATION,
	easing: quadOut,
	delay: 0,
};
