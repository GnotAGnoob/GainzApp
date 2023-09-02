<script lang="ts">
	import { page } from "$app/stores";
	import { onDestroy, onMount } from "svelte";

	import paths from "$lib/paths";
	import NavbarLink from "./NavbarLink.svelte";
	// TODO ZJISTIT JAK DLOUHO TRVA NACTENI LAJNY,

	const TIMEOUT = 100;

	const elements: number[] = [];
	let timeoutId: number;
	let parentElement: HTMLUListElement;
	let activeElement = Object.keys(paths).findIndex((path) => path === $page.url.pathname);
	let right: number;
	let left: number;

	const calculateLine = (isDelay?: boolean) => {
		if (activeElement === -1) return;

		let leftTemp = 0;
		const gap = parseInt(getComputedStyle(parentElement).gap) || 0;

		for (let i = 0; i < activeElement; i++) {
			leftTemp += elements[i] + gap;
		}

		const rightTemp = parentElement.clientWidth - (leftTemp + elements[activeElement]);

		if (!isDelay) {
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
		activeElement = index;
		calculateLine(true);
	};

	onMount(() => {
		calculateLine();
	});

	onDestroy(() => {
		clearTimeout(timeoutId);
	});
</script>

<svelte:window on:resize={onResize} />

<nav class="nav">
	<ul class="navLinks" bind:this={parentElement}>
		{#each Object.entries(paths) as [href, text], index (href)}
			<NavbarLink {href} {text} bind:clientWidth={elements[index]} {onClick} {index} />
		{/each}
		<span class="line" style={`right: ${right}px; left: ${left}px`} />
	</ul>
</nav>

<style lang="scss">
	@import "./header.scss";

	.nav {
		&Links {
			display: flex;
			position: relative;

			align-items: center;
			justify-content: center;
			gap: $space-lg;
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

		@media (max-width: $bp-header) {
			display: none;
		}
	}
</style>
