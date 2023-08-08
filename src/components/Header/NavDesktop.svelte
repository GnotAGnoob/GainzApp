<script>
	import NavbarLinks from "./NavbarLinks.svelte";
</script>

<div class="nav">
	<NavbarLinks class="navLinks" />
</div>

<style lang="scss">
	.nav :global(.navLinks) {
		display: flex;

		align-items: center;
		justify-content: center;
		gap: 2rem;
	}
</style>
