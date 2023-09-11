<script lang="ts">
	import Icon from "@iconify/svelte";
	import Navigation from "./Navigation.svelte";
	import { session } from "$src/lib/stores/session";
	import Profile from "./Profile.svelte";
	import Scroller from "../Scroller.svelte";

	// TODO: hiddable header
</script>

<header class="header">
	<div class="wrapper">
		<a class="iconWrapper" href="/">
			<Icon class="icon" icon="solar:donut-bitten-bold-duotone" />
		</a>
		{#if $session !== null}
			<div class="mobile mobile_top">
				<Profile class="profile" />
			</div>
			<div class="desktop">
				<Navigation />
				<Profile class="profile" />
			</div>
		{/if}
	</div>
	{#if $session !== null}
		<div class="mobile mobile_bottom">
			<Scroller>
				<Navigation />
			</Scroller>
		</div>
	{/if}
</header>

<style lang="scss">
	@import "./header.scss";
	$sitePadding: $space-md;

	.mobile {
		@media (min-width: $bp-header) {
			display: none;
		}

		&_bottom {
			padding-bottom: $space-xxs;
		}
	}

	.header {
		display: flex;
		position: sticky;

		top: 0;

		width: 100%;
		border-bottom: $header-border-height solid var(--accent-neutral-200);

		flex-direction: column;

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

	.desktop {
		display: grid;

		min-height: 0;
		height: 100%;

		grid-template-columns: 3fr 1fr;
		grid-template-rows: 1fr;
		justify-items: center;
		align-items: center;

		@media (max-width: $bp-header) {
			display: none;
		}

		:global(.profile) {
			justify-self: flex-end;
		}
	}

	.wrapper {
		display: flex;

		height: 100%;
		width: 100%;
		max-width: $max-width;
		margin-inline: auto;
		padding: $space-sm $space-md $space-xs;

		align-items: center;
		justify-content: space-between;

		@media (min-width: $bp-header) {
			display: grid;

			padding: $space-sm $space-md;

			grid-template-columns: 1fr 4fr;
		}
	}
</style>
