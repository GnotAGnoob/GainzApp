<script>
	import Icon from "@iconify/svelte";
	import NavDesktop from "./NavDesktop.svelte";
	import NavMobile from "./NavMobile.svelte";

	// TODO: hiddable header
</script>

<header class="header">
	<div class="wrapper">
		<a class="iconWrapper" href="/">
			<Icon class="icon" icon="solar:donut-bitten-bold-duotone" />
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

	:global(.toaster) {
		top: $header-height + $space-md !important;
	}

	.header {
		position: sticky;

		top: 0;

		width: 100%;
		height: $header-height;
		border-bottom: $header-border-height solid var(--accent-neutral-200);

		background-color: var(--background-color);

		z-index: 100;
	}

	.iconWrapper {
		height: 2rem;
		width: 2rem;
	}

	.header :global(.icon) {
		height: 100%;
		width: 100%;
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
