<script>
	import { page, navigating } from "$app/stores";
	import { getPageTitle } from "$lib/getPageTitle";
	import Header from "../components/Header/Header.svelte";
	import FloatingCorner from "$src/components/FloatingCorner.svelte";
	import { Toaster } from "svelte-french-toast";
	import "$sass/global.scss";
	import EnvironmentBanner from "$src/components/EnvironmentBanner.svelte";
	import { session } from "$src/lib/stores/session";
	import { floatedCorner } from "$src/lib/stores/floatedCorner";
	// import Swatch from "$src/components/Swatch.svelte";

	export let data;

	session.set(data.session);

	$: if ($navigating) {
		$floatedCorner = [];
	}
</script>

<svelte:head>
	<title>{getPageTitle($page.route.id)}</title>
</svelte:head>
<!-- <Swatch /> -->

<div class="content">
	{#if import.meta.env.MODE === "development"}
		<EnvironmentBanner type={import.meta.env.MODE === "development" ? "positive" : "info"}>
			This is a <span class="bannerText">{import.meta.env.MODE}</span> environment!
		</EnvironmentBanner>
	{/if}
	<Header />
	<FloatingCorner />
	<Toaster />
	<div class="container">
		<div class="wrapper">
			<main class="main">
				<slot />
			</main>
			<footer class="footer">
				<div>© 2023 Daniel Svátek</div>
				<div>v{data.version}</div>
			</footer>
		</div>
	</div>
	<div id="modal" />
</div>

<style lang="scss">
	.content {
		display: flex;

		flex-direction: column;
		flex-grow: 1;
	}
	.wrapper {
		display: flex;

		width: 100%;
		max-width: $max-width;
		height: 100%;
		padding-inline: var(--site-padding);
		margin-inline: auto;

		flex-grow: 1;
		flex-direction: column;
		justify-content: space-between;
	}

	.main {
		display: flex;
		flex-direction: column;

		flex-grow: 1;
	}

	.footer {
		display: flex;

		margin-top: $space-md;
		padding-block: $space-sm $space-xs;

		justify-content: space-between;

		font-size: $text-copyright;
		color: var(--text-secondary);
	}

	.container {
		display: flex;

		width: 100%;
		max-width: 100%;

		flex-direction: column;
		flex-shrink: 0;
		flex-grow: 1;
	}

	.bannerText {
		font-weight: 700;
	}
</style>
