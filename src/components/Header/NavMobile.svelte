<script lang="ts">
	import { Burger } from "@svelteuidev/core";
	import NavbarLinks from "./NavbarLinks.svelte";

	let opened = false;
</script>

<div class="nav">
	<Burger {opened} on:click={() => (opened = !opened)} />
	<div class="navLinksWrapper" class:navLinksWrapper_opened={opened}>
		<NavbarLinks class="navLinks" />
	</div>
</div>

<style lang="scss">
	@import "./header.scss";

	.navLinksWrapper {
		position: absolute;
		top: 100%;
		left: 100%;

		width: 100%;
		min-height: calc(100vh - $header-height);

		background-color: white;

		transition: left 0.1s ease-out;

		z-index: 1;

		&_opened {
			left: 0;
		}

		& :global(.navLinks) {
			display: flex;

			flex-direction: column;
		}
	}
</style>
