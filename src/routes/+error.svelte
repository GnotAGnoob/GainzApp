<script>
	import { page } from "$app/stores";
	import { getPageTitle } from "$lib/getPageTitle";
</script>

<svelte:head>
	<title>{getPageTitle(`${$page.status}`)}</title>
</svelte:head>

<!-- TODO HANDLE DIFFERENT ERRORS -->
<h2>{$page.status}: {$page.error?.message}</h2>
