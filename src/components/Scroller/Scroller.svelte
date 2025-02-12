<script lang="ts">
	import { onMount } from "svelte";
	import Icon from "@iconify/svelte";
	import type { StylesType } from "$src/lib/types";

	const SCROLL_REDUCTION = 0.8;

	export let type: StylesType = "neutral";
	export let sideFade: "small" | "medium" | "large" = "small";
	export let isSidePadding = true;
	export let isScrollReverse = false;
	export let wrapperTag: "div" | "ul" | "ol" = "div";
	export let arrowsPosition: "top" | "full" | undefined = undefined;
	export let bottomPadding: "small" | "medium" | "large" = "small";
	export let isScrollToEnd = false;
	export let onClick: (() => void) | undefined = undefined;

	let scrollElement: HTMLElement | null = null;
	let isOverflowingLeft = false;
	let isOverflowingRight = false;

	export const setOverflowing = () => {
		if (!scrollElement) return;

		const normalizedScrollLeft = Math.abs(scrollElement.scrollLeft);
		const isOverflowLeft = normalizedScrollLeft > 0;
		const isOverflowRight = normalizedScrollLeft + scrollElement.clientWidth < scrollElement.scrollWidth;

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

		if (!scrollElement) return;

		const scrollDirection = direction === "left" ? -1 : 1;

		scrollElement.scrollBy({
			left: scrollElement.clientWidth * scrollDirection * SCROLL_REDUCTION,
			behavior: "smooth",
		});
	};

	export const scrollToEnd = (to: "end" | "start" = "end") => {
		// timeout is needed because of possible added elements
		setTimeout(() => {
			if (!scrollElement) return;

			let scrollDirection = to === "end" ? 1 : -1;

			if (isScrollReverse) {
				scrollDirection *= -1;
			}

			scrollElement.scrollBy({
				left: scrollElement.scrollWidth * scrollDirection,
				behavior: "smooth",
			});
		}, 0);
	};

	$: if (isScrollToEnd && scrollElement) {
		scrollToEnd("end");
	}
</script>

<svelte:window on:resize={setOverflowing} />

<div
	class="arrowsWrapper arrowsWrapper_{type} arrowsWrapper_{sideFade}Fade"
	class:arrowsWrapper_noSidePadding={!isSidePadding}
>
	{#if arrowsPosition}
		{#if isOverflowingLeft}
			<button class="button button_left button_{arrowsPosition}" on:click={(event) => scroll(event, "left")}>
				<Icon icon="solar:alt-arrow-left-bold" />
			</button>
		{/if}
		{#if isOverflowingRight}
			<button class="button button_right button_{arrowsPosition}" on:click={(event) => scroll(event, "right")}>
				<Icon icon="solar:alt-arrow-right-bold" />
			</button>
		{/if}
	{/if}
	<div
		class="contentWrapper"
		bind:this={scrollElement}
		on:scroll={setOverflowing}
		class:contentWrapper_reverse={isScrollReverse}
	>
		{#if onClick}
			<button class="elementButton" on:click={onClick} type="button">
				<svelte:element
					this={wrapperTag}
					class="contentContainer contentContainer_{bottomPadding}"
					class:contentContainer_reverse={isScrollReverse}
				>
					<slot />
				</svelte:element>
			</button>
		{:else}
			<svelte:element
				this={wrapperTag}
				class="contentContainer contentContainer_{bottomPadding}"
				class:contentContainer_reverse={isScrollReverse}
			>
				<slot />
			</svelte:element>
		{/if}
	</div>
</div>

<style lang="scss">
	.arrowsWrapper {
		--_background-color: var(--accent-neutral-200);
		--_button-background-hover: var(--accent-neutral-300);
		--_side-padding: $space-sm;
		--_text-secondary-color: var(--text-secondary-2);

		--_background-start: 0%;

		position: relative;

		&::after,
		&::before {
			content: "";

			position: absolute;

			top: 0;
			bottom: 0;

			width: var(--_side-padding);

			background: transparent;
			background: linear-gradient(90deg, var(--_background-color) var(--_background-start), transparent 100%);

			z-index: 25;
		}

		&::before {
			left: 0;
		}

		&::after {
			right: 0;
			transform: rotate(180deg);
		}

		&_positive {
			--_button-background-hover: var(--accent-positive-300);
			--_background-color: var(--accent-positive-200);
			--_text-secondary-color: var(--accent-positive-700);
		}

		&_info {
			--_button-background-hover: var(--accent-info-300);
			--_background-color: var(--accent-info-200);
			--_text-secondary-color: var(--accent-info-700);
		}

		&_background {
			--_button-background-hover: var(--accent-neutral-100);
			--_background-color: var(--background-color);
			--_text-secondary-color: var(--text-secondary-2);
		}

		&_mediumFade {
			--_side-padding: #{$space-md};
		}

		&_largeFade {
			--_side-padding: #{$space-lg};
			--_background-start: 25%;
		}

		&_noSidePadding {
			--_side-padding: 0;
		}
	}

	.content {
		&Container {
			--scroller-padding: #{$space-sm};

			display: flex;

			margin: auto;
			padding-inline: var(--_side-padding);
			gap: $space-md;

			padding-bottom: var(--scroller-padding);

			&_reverse {
				flex-direction: row-reverse;
			}

			&_medium {
				--scroller-padding: #{$space-md};
			}
		}

		&Wrapper {
			display: flex;

			overflow-x: auto;

			&_reverse {
				flex-direction: row-reverse;
			}
		}
	}

	.button {
		--_padding: #{$space-xxs};
		--_border: #{$border-sm};

		display: flex;
		position: absolute;

		padding-block: var(--_padding);

		justify-content: center;
		align-items: center;

		color: var(--_text-secondary-color);
		font-size: $icon-md;
		background-color: var(--_background-color);

		z-index: 30;

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

		&_top {
			top: #{-$space-xxs};
		}

		&_full {
			top: 0;
			bottom: 0;
			width: var(--_side-padding);
			background-color: transparent;
			--_button-background-hover: var(--accent-neutral-200);
		}
	}

	.elementButton {
		width: 100%;
	}
</style>
