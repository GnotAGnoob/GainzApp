<script lang="ts">
	import paths from "$lib/paths";
	import { Burger } from "@svelteuidev/core";
	import NavbarLink from "./NavbarLink.svelte";

	let opened = false;
</script>

<div class="burgerWrapper">
	<Burger class="burger" {opened} on:click={() => (opened = !opened)} color="var(--text-primary)" />
</div>
<nav class="nav" class:nav_opened={opened}>
	<ul class="navLinks">
		{#each Object.entries(paths) as [href, text], index (href)}
			<NavbarLink {href} {text} {index} />
		{/each}
	</ul>
</nav>

<style lang="scss">
	@import "./header.scss";

	.burger {
		&Wrapper :global(.burger) {
			transform: scale(1.25);
		}
	}

	.nav {
		position: absolute;

		top: calc(100% + $header-border-height);
		left: 100%;

		width: 100%;
		// min-height: calc(100vh - $header-height - $header-border-height);

		background-color: var(--accent-neutral-100);

		transition: left 0.1s ease-out;

		&_opened {
			left: 0;
		}

		&Links {
			display: flex;

			flex-direction: column;
		}
	}
</style>
