<script lang="ts">
	import { page } from "$app/stores";
	import NavbarLink from "./NavbarLink.svelte";
	import { onDestroy, onMount } from "svelte";
	// TODO ZJISTIT JAK DLOUHO TRVA NACTENI LAJNY

	const TIMEOUT = 100;

	const paths = {
		"/": "Home",
		"/create": "Create",
		"/list": "List",
	};

	const elements: number[] = [];
	let timeoutId: number;
	let parentElement: HTMLUListElement;
	let activeElement: number = Object.keys(paths).findIndex((path) => path === $page.url.pathname);
	let right: number;
	let left: number;

	const calculateLine = (isDelay?: boolean) => {
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

	const onClick = (index: number) => {
		activeElement = index;
		calculateLine(true);
	};

	onMount(() => {
		if (activeElement >= 0) {
			calculateLine();
		}
	});

	onDestroy(() => {
		clearTimeout(timeoutId);
	});
</script>

<nav class="nav">
	<ul class={$$props.class} bind:this={parentElement}>
		{#each Object.entries(paths) as [href, text], index (href)}
			<NavbarLink {href} {text} bind:clientWidth={elements[index]} {onClick} {index} />
		{/each}
	</ul>
	<span class="line" style={`right: ${right}px; left: ${left}px`} />
</nav>

<style lang="scss">
	@import "./header.scss";

	.nav {
		position: relative;
	}

	.line {
		--_transition: 0.1s ease;

		position: absolute;

		left: 0;
		bottom: 0;

		height: 0.1rem;

		background-color: white;

		transition: right var(--_transition), left var(--_transition);

		@media (max-width: $bp-header) {
			display: none;
		}
	}
</style>
