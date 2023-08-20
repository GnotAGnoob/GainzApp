<script lang="ts">
	import { onMount } from "svelte";
	import Icon from "@iconify/svelte";
	import type { workoutType } from "./Exercises";

	const SCROLL_REDUCTION = 0.8;
	export let type: Omit<workoutType, "history2"> = "default";
	export let sideFade: "small" | "medium" = "small";
	export let isScrollReverse = false;

	let scrollElement: HTMLDivElement;
	let isOverflowingLeft = false;
	let isOverflowingRight = false;

	const setOverflowing = () => {
		const normalizedScrollLeft = Math.abs(scrollElement.scrollLeft);
		const isOverflowLeft = normalizedScrollLeft > 0;
		const isOverflowRight = normalizedScrollLeft + scrollElement.clientWidth < scrollElement.scrollWidth;

		console.log("setOverflowing", normalizedScrollLeft, scrollElement.clientWidth, scrollElement.scrollWidth);

		if (isScrollReverse) {
			isOverflowingLeft = isOverflowRight;
			isOverflowingRight = isOverflowLeft;
			return;
		}

		isOverflowingLeft = isOverflowLeft;
		isOverflowingRight = isOverflowRight;
	};

	onMount(() => {
		setOverflowing();
	});

	const scroll = (event: MouseEvent, direction: "left" | "right") => {
		event.stopPropagation();
		const scrollDirection = direction === "left" ? -1 : 1;

		scrollElement.scrollBy({
			left: scrollElement.clientWidth * scrollDirection * SCROLL_REDUCTION,
			behavior: "smooth",
		});
	};
</script>

<svelte:window on:resize={setOverflowing} />

<div class="arrowsWrapper arrowsWrapper_{type} arrowsWrapper_{sideFade}Fade">
	{#if isOverflowingLeft}
		<button class="button button_left" on:click={(event) => scroll(event, "left")}>
			<Icon icon="solar:alt-arrow-left-bold" />
		</button>
	{/if}
	{#if isOverflowingRight}
		<button class="button button_right" on:click={(event) => scroll(event, "right")}>
			<Icon icon="solar:alt-arrow-right-bold" />
		</button>
	{/if}
	<div class="contentWrapper">
		<div
			class="contentContainer"
			class:contentContainer_reverse={isScrollReverse}
			bind:this={scrollElement}
			on:scroll={setOverflowing}
		>
			<slot />
		</div>
	</div>
</div>

<style lang="scss">
	@import "./Exercises.scss";

	.arrowsWrapper {
		--_background-color: #{$background-color-default};
		--_button-background-hover: var(--accent-info-300);
		--_side-padding: #{$item-side-padding};
		--_button-position: #{-$space-xxs};

		// display: flex;
		position: relative;

		&_best {
			--_button-background-hover: var(--accent-positive-300);
			--_background-color: #{$background-color-best};
		}

		&_history {
			--_button-background-hover: var(--accent-neutral-400);
			--_background-color: #{$background-color-history};

			--_button-position: #{$space-xs};
		}

		&_mediumFade {
			--_side-padding: #{$space-md};
		}
	}

	.content {
		&Container {
			display: flex;

			width: 100%;

			padding-bottom: $scroller-padding;
			overflow-x: scroll;

			&_reverse {
				flex-direction: row-reverse;
			}
		}

		&Wrapper {
			position: relative;

			&::after,
			&::before {
				content: "";

				position: absolute;

				top: 0;
				bottom: 0;

				width: var(--_side-padding);

				background: transparent;
				background: linear-gradient(90deg, var(--_background-color) 0%, transparent 100%);
			}

			&::before {
				left: 0;
			}

			&::after {
				right: 0;
				transform: rotate(180deg);
			}
		}
	}

	.button {
		--_padding: #{$space-xxs};
		--_border: #{$border-sm};

		display: flex;
		position: absolute;

		padding-block: var(--_padding);

		top: var(--_button-position);

		justify-content: center;
		align-items: center;

		color: var(--_text-secondary-color);
		font-size: $icon;
		background-color: var(--_background-color);

		z-index: 10;

		&:hover {
			background-color: var(--_button-background-hover);
		}

		&_left {
			padding-right: var(--_padding);

			border-top-right-radius: var(--_border);
			border-bottom-right-radius: var(--_border);
		}

		&_right {
			padding-left: var(--_padding);
			border-top-left-radius: var(--_border);
			border-bottom-left-radius: var(--_border);
			right: 0;
		}
	}
</style>
