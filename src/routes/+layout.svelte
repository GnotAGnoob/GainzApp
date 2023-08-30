<!-- TODO: handle responsivity, margins and max width, add nav -->
<script>
	import { page } from "$app/stores";
	import { getPageTitle } from "$lib/getPageTitle";
	import Header from "../components/Header/Header.svelte";
	import FloatingCorner from "$src/components/FloatingCorner.svelte";
	import { Toaster } from "svelte-french-toast";
	import "$sass/global.scss";
	import EnvironmentBanner from "$src/components/EnvironmentBanner.svelte";
</script>

<svelte:head>
	<title>{getPageTitle($page.route.id)}</title>
</svelte:head>

{#if import.meta.env.MODE === "development" || import.meta.env.MODE === "staging"}
	<EnvironmentBanner type={import.meta.env.MODE === "development" ? "positive" : "info"}>
		This is a <span class="bannerText">{import.meta.env.MODE}</span> environment!
	</EnvironmentBanner>
{/if}
<Header />
<FloatingCorner />
<Toaster />
<div class="container">
	<div class="wrapper">
		<main>
			<slot />
		</main>
		<footer class="footer">© 2023 Daniel Svátek</footer>
	</div>
</div>

<style lang="scss">
	.wrapper {
		display: flex;

		max-width: $max-width;
		padding-inline: var(--site-padding);
		height: 100%;

		flex-direction: column;
		justify-content: space-between;
	}

	.footer {
		margin-top: $space-md;
		padding-block: $space-sm $space-xs;

		font-size: $text-copyright;
		color: var(--text-secondary);
	}

	.container {
		height: 100%;
		max-width: 100%;
		margin-inline: auto;
	}

	.bannerText {
		font-weight: 700;
	}
</style>
