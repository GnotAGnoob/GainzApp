<script lang="ts">
	import Icon from "@iconify/svelte";
	import NavDesktop from "./NavDesktop.svelte";
	import NavMobile from "./NavMobile.svelte";
	import { session } from "$src/lib/stores/session";
	import Profile from "./Profile.svelte";

	// TODO: hiddable header
</script>

<header class="header">
	<div class="wrapper">
		<a class="iconWrapper" href="/">
			<Icon class="icon" icon="solar:donut-bitten-bold-duotone" />
		</a>
		{#if $session !== null}
			<div class="mobile">
				<Profile class="profile" />
				<NavMobile />
			</div>
			<div class="desktop">
				<NavDesktop />
				<Profile class="profile" />
			</div>
		{/if}
	</div>
</header>

<style lang="scss">
	@import "./header.scss";

	.mobile {
		display: flex;

		gap: $space-sm + $space-xs;
		align-items: center;
	}

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

		:global(.profile) {
			margin-top: $space-px;
		}
	}

	.iconWrapper {
		height: 2rem;
		width: 2rem;
	}

	.header :global(.icon) {
		height: 100%;
		width: 100%;
	}

	.mobile {
		@media (min-width: $bp-header) {
			display: none;
		}
	}

	.desktop {
		display: grid;

		grid-template-columns: 3fr 1fr;
		justify-items: center;

		@media (max-width: $bp-header) {
			display: none;
		}

		:global(.profile) {
			justify-self: flex-end;
		}
	}

	.wrapper {
		display: flex;

		max-width: $max-width;
		margin-inline: auto;
		padding: 0.6rem 1.2rem;

		align-items: center;
		justify-content: space-between;

		@media (min-width: $bp-header) {
			display: grid;

			grid-template-columns: 1fr 4fr;
		}
	}
</style>
