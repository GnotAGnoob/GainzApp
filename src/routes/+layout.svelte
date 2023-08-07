<!-- TODO: handle responsivity, margins and max width, add nav -->
<script>
    import { page } from "$app/stores";
	import { getPageTitle } from "$lib/getPageTitle";
	import Header from "../components/Header/Header.svelte";
</script>

<svelte:head>
    <title>{getPageTitle($page.route.id)}</title>
</svelte:head>

<main>
    <Header />
    <slot />
</main>