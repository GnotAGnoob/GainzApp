<script lang="ts">
	import { onDestroy, onMount } from "svelte";

	const TIMEOUT = 100;

	export let activeElement = 0;
	let elements: HTMLCollection | undefined = undefined;
	let timeoutId: number;
	let parentElement: HTMLDivElement;
	let right: number | undefined;
	let left: number | undefined;

	const calculateLine = (isDelay?: boolean) => {
		elements = parentElement.children;
		if (activeElement < 0 || activeElement > elements.length) return;

		let leftTemp = 0;
		const gap = parseInt(getComputedStyle(parentElement).gap) || 0;

		for (let i = 0; i < activeElement; i++) {
			leftTemp += elements[i].clientWidth + gap;
		}

		const rightTemp = parentElement.clientWidth - (leftTemp + elements[activeElement].clientWidth);

		if (!isDelay || left === undefined || right === undefined) {
			left = leftTemp;
			right = rightTemp;
			return;
		}

		if (leftTemp < left) {
			left = leftTemp;
			timeoutId = window.setTimeout(() => {
				right = rightTemp;
			}, TIMEOUT);
		} else {
			right = rightTemp;
			timeoutId = window.setTimeout(() => {
				left = leftTemp;
			}, TIMEOUT);
		}
	};

	const onResize = () => {
		if (parentElement.clientWidth === 0) return;
		calculateLine();
	};

	const onClick = (index: number) => {
		// @ts-ignore
		if (!document.startViewTransition) {
			activeElement = index;
			calculateLine(true);
			return;
		}

		// @ts-ignore
		document.startViewTransition(async () => {
			activeElement = index;
			calculateLine(true);
		});
	};

	onMount(() => {
		calculateLine();
	});

	onDestroy(() => {
		clearTimeout(timeoutId);
	});
</script>

<svelte:window on:resize={onResize} />

<div class="wrapper">
	<div class="itemsWrapper">
		<div class="items" bind:this={parentElement}>
			<slot prop={onClick} />
			{#if left !== undefined && right !== undefined}
				<span class="line" style={`right: ${right}px; left: ${left}px`} />
			{/if}
		</div>
	</div>

	<div class="content">
		<slot name="content" />
	</div>
</div>

<style lang="scss">
	.items {
		display: flex;
		position: relative;

		align-items: center;

		gap: $space-lg;

		&Wrapper {
			display: flex;

			justify-content: center;
		}
	}

	.line {
		--_transition: 0.1s ease;

		position: absolute;

		left: 0;
		bottom: -$space-xs;

		height: $space-xxs;

		background-color: var(--text-primary--hover);

		transition: right var(--_transition), left var(--_transition);
	}
</style>
