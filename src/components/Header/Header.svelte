<script>
	import Icon from "@iconify/svelte";
	import { Burger, MediaQuery } from "@svelteuidev/core";
	import NavbarLinks from "./NavbarLinks.svelte";

	const x = 960;
</script>

<header>
	<a href="/">
		<Icon icon="mdi:home" />
	</a>
	<div class="burger">
		<Burger opened={false} />
		<MediaQuery query="(min-width: {x}px)">
			<NavbarLinks />
		</MediaQuery>
	</div>
</header>

<style lang="scss">
	@import "$variables/breakpoints.scss";

	@media (max-width: $bp-960) {
		.burger {
			display: none;
		}
	}
</style>
