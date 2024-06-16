import { quadOut } from "svelte/easing";
import type { TransitionConfig } from "svelte/transition";

export const TRANSITION_DURATION = 300;
export const TRANSITION_DURATION_FAST = 150;
export const TRANSITION_DURATION_SLOW = 450;

export const TRANSITION_CONFIG: TransitionConfig = {
	duration: TRANSITION_DURATION,
	easing: quadOut,
	delay: 0,
};
