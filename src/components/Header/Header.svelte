<script>
	import Icon from "@iconify/svelte";
	import NavDesktop from "./NavDesktop.svelte";
	import NavMobile from "./NavMobile.svelte";
</script>

<header class="header">
	<div class="wrapper">
		<a href="/">
			<Icon class="icon" icon="mdi:home" />
		</a>
		<div class="mobile">
			<NavMobile />
		</div>
		<div class="desktop">
			<NavDesktop />
		</div>
	</div>
</header>

<style lang="scss">
	@import "./header.scss";

	.header {
		position: relative;
		width: 100%;
		height: $header-height;

		border-bottom: $header-border-height solid var(--accent-neutral-200);
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

	.wrapper {
		display: flex;

		max-width: $max-width;
		margin-inline: auto;
		padding: 0.6rem 1.2rem;

		align-items: center;
		justify-content: space-between;
	}
</style>
