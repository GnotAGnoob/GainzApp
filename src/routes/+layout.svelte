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
<div class="wrapper">
	<main>
		<slot />
	</main>
</div>
<BackToTop />

<style lang="scss">
	.wrapper {
		max-width: $max-width;
		margin: auto;

		padding-inline: $site-padding;
	}
</style>
