<script>
	import Icon from "@iconify/svelte";
	import NavDesktop from "./NavDesktop.svelte";
	import NavMobile from "./NavMobile.svelte";
</script>

<header class="header">
	<a href="/">
		<Icon class="icon" icon="mdi:home" />
	</a>
	<div class="mobile">
		<NavMobile />
	</div>

	<div class="desktop">
		<NavDesktop />
	</div>
</header>

<style lang="scss">
	@import "./header.sass";

	.header {
		display: flex;

		width: 100%;
		height: 3.2rem;
		padding: 0.6rem 1.2rem;

		align-items: center;
		justify-content: space-between;

		background-color: red;
	}

	.header :global(.icon) {
		height: 2rem;
		width: 2rem;
	}

	@media (min-width: $bp-header) {
		.mobile {
			display: none;
		}
	}

	@media (max-width: $bp-header) {
		.desktop {
			display: none;
		}
	}
</style>
