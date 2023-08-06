<!-- TODO: handle responsivity, margins and max width, add nav -->
<script>
    import { page } from "$app/stores";
	import { getPageTitle } from "$lib/getPageTitle";

    const x = "1";
</script>

<svelte:head>
    <title>{getPageTitle($page.route.id)}</title>
</svelte:head>

<main>
    <slot />
</main>