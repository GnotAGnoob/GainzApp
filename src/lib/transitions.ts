import { quadOut } from "svelte/easing";
import type { FlyParams, TransitionConfig } from "svelte/transition";

export const TRANSITION_DURATION = 300;
export const TRANSITION_DURATION_FAST = 150;
export const TRANSITION_DURATION_SLOW = 450;

export const TRANSITION_CONFIG: TransitionConfig = {
	duration: TRANSITION_DURATION,
	easing: quadOut,
	delay: 0,
};

export const getFlyTransitionConfig = (x = 0, y = 50): FlyParams => ({
	duration: TRANSITION_DURATION,
	easing: quadOut,
	delay: 0,
	x,
	y,
});
