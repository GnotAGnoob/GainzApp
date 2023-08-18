<script lang="ts">
	import type { load } from "$src/routes/+page.server";
	import { onMount } from "svelte";
	import Set from "./Set.svelte";
	import Icon from "@iconify/svelte";

	export let sets: Awaited<ReturnType<typeof load>>["categories"][0]["exercises"][0]["history"][0]["sets"];

	let scrollElement: HTMLDivElement;
	let isOverflowingLeft = false;
	let isOverflowingRight = false;

	const setOverflowing = () => {
		isOverflowingLeft = scrollElement.scrollLeft > 0 ? true : false;
		const isScrollEnd = scrollElement.scrollLeft + scrollElement.clientWidth === scrollElement.scrollWidth;
		isOverflowingRight = isScrollEnd ? false : true;
	};

	onMount(() => {
		setOverflowing();
	});

	const scroll = (direction: "left" | "right") => {
		const scrollDirection = direction === "left" ? -1 : 1;

		scrollElement.scrollBy({
			left: scrollElement.scrollWidth * scrollDirection,
			behavior: "smooth",
		});
	};
</script>

<div class="arrowsWrapper">
	{#if isOverflowingLeft}
		<button class="button button--left" on:click={() => scroll("left")}>
			<Icon icon="solar:alt-arrow-left-bold" />
		</button>
	{/if}
	{#if isOverflowingRight}
		<button class="button button--right" on:click={() => scroll("right")}>
			<Icon icon="solar:alt-arrow-right-bold" />
		</button>
	{/if}
	<div class="setsWrapper">
		<div class="setsContainer" bind:this={scrollElement} on:scroll={setOverflowing}>
			<ul class="sets">
				{#each sets as set, index}
					<Set setNumber={index + 1} weight={set.weight} reps={set.reps} />
				{/each}
			</ul>
		</div>
	</div>
</div>

<style lang="scss">
	.sets {
		display: grid;

		width: max-content;
		margin: auto;

		grid-auto-columns: 1fr;
		grid-auto-flow: column;

		&Container {
			width: 100%;

			padding-bottom: $space-sm;
			overflow-x: scroll;
		}

		&Wrapper {
			position: relative;

			&::after,
			&::before {
				content: "";

				position: absolute;

				top: 0;
				bottom: 0;

				width: var(--_item-side-padding);

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

	.arrowsWrapper {
		position: relative;
	}

	.button {
		display: flex;
		position: absolute;

		justify-content: center;
		align-items: center;

		color: var(--_text-secondary-color);
		font-size: $icon;
		background-color: var(--_background-color);

		z-index: 1;

		&:hover {
			background-color: var(--_button-background-hover);
		}

		&--left {
			border-top-right-radius: $border-sm;
			border-bottom-right-radius: $border-sm;
		}

		&--right {
			border-top-left-radius: $border-sm;
			border-bottom-left-radius: $border-sm;
			right: 0;
		}
	}
</style>
