<script>
	import { page } from "$app/stores";
	import { getPageTitle } from "$lib/getPageTitle";
	import Error from "$src/components/Errors/Error.svelte";
</script>

<svelte:head>
	<title>{getPageTitle(`${$page.status}`)}</title>
</svelte:head>

<Error message={`${$page.status}: ${$page.error?.message}`} />
