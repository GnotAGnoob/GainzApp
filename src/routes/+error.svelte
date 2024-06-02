<script>
	import { page } from "$app/stores";
	import { getPageTitle } from "$lib/getPageTitle";
	import ErrorPage from "$src/components/Errors/ErrorPage.svelte";
</script>

<svelte:head>
	<title>{getPageTitle(`${$page.status}`)}</title>
</svelte:head>

<ErrorPage message={`${$page.status}: ${$page.error?.message}`} isRefreshButton={$page.status !== 404} />
