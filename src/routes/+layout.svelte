<!-- TODO: handle responsivity, margins and max width, add nav -->
<script>
	import { page } from "$app/stores";
	import { getPageTitle } from "$lib/getPageTitle";
	import Header from "../components/Header/Header.svelte";
	import BackToTop from "$src/components/BackToTop.svelte";
	import "$sass/global.scss";
</script>

<svelte:head>
	<title>{getPageTitle($page.route.id)}</title>
</svelte:head>

<Header />
<BackToTop />
<div class="wrapper">
	<main>
		<slot />
	</main>
	<footer class="footer">© 2023 Daniel Svátek</footer>
</div>

<style lang="scss">
	.wrapper {
		max-width: $max-width;
		margin: auto;

		padding-inline: $site-padding;
	}

	.footer {
		padding-block: $space-sm $space-xs;

		font-size: $text-copyright;
		color: var(--text-secondary);
	}
</style>
