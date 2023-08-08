<script lang="ts">
	import { Burger } from "@svelteuidev/core";
	import NavbarLinks from "./NavbarLinks.svelte";

	let opened = false;
</script>

<div class="nav">
	<Burger {opened} on:click={() => (opened = !opened)} />
	{#if opened}
		<NavbarLinks class="navLinks" />
	{/if}
</div>

<style lang="scss">
	// TODO: styels + dropdown
</style>
