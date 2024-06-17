import { quadOut } from "svelte/easing";
import { fly, type FlyParams, type TransitionConfig } from "svelte/transition";

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

export const flyThin = (
	node: Element,
	{ delay = 0, duration = TRANSITION_DURATION, easing = quadOut, x = 0, y = 0, opacity = 0 }: FlyParams = {},
): TransitionConfig => {
	return {
		duration,
		delay,
		easing,

		css: (t, u) => {
			const eased = easing(t);
			const basicFly = fly(node, { duration, easing, x, y, opacity }).css?.(t, u);
			const width = node.getBoundingClientRect().width;
			console.log(width);
			console.log(basicFly);

			return `${basicFly};
					width: ${width * eased}px;`;
		},
	};
};
