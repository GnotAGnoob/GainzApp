import { linear, quadOut } from "svelte/easing";
import { fly, type FlyParams, type TransitionConfig } from "svelte/transition";

export const TRANSITION_DURATION = 225;
export const TRANSITION_DURATION_FAST = 150;
export const TRANSITION_DURATION_SLOW = 350;

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

export const thinVertical = (
	node: Element,
	{ delay = 0, duration = TRANSITION_DURATION, easing = quadOut }: FlyParams = {},
): TransitionConfig => {
	return {
		duration,
		delay,

		css: (t) => {
			const eased = easing(t);

			return `height: ${100 * eased}%;`;
		},
	};
};

export const thinHorizontal = (
	node: Element,
	{ delay = 0, duration = TRANSITION_DURATION, easing = linear }: FlyParams = {},
): TransitionConfig => {
	return {
		duration,
		delay,

		css: (t) => {
			const eased = easing(t);

			return `width: ${100 * eased}%;`;
		},
	};
};
