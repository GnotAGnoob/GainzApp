<script lang="ts">
	import { page } from "$app/stores";

	import paths from "$lib/paths";
	import NavbarLink from "./NavbarLink.svelte";
	import Tabs from "../Tabs.svelte";
</script>

<nav>
	<ul>
		<Tabs let:prop={onClick} activeElement={Object.keys(paths).findIndex((path) => path === $page.url.pathname)}>
			{#each Object.entries(paths) as [href, text], index (href)}
				<NavbarLink {href} {text} {onClick} {index} />
			{/each}
		</Tabs>
	</ul>
</nav>

<style lang="scss">
</style>
