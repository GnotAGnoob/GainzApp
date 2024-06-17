import { quadOut } from "svelte/easing";
import type { TransitionConfig } from "svelte/transition";

export const TRANSITION_DURATION = 225;
export const TRANSITION_DURATION_FAST = 150;
export const TRANSITION_DURATION_SLOW = 350;

export const TRANSITION_CONFIG: TransitionConfig = {
	duration: TRANSITION_DURATION,
	easing: quadOut,
	delay: 0,
};
