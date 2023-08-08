<script lang="ts">
	import type { SvelteHTMLElements } from "svelte/elements";
	import NavbarLink from "./NavbarLink.svelte";
	import { onMount } from "svelte";

	const paths = {
		"/": "Home",
		"/create": "Create",
		"/list": "List",
	};

	let elements: number[] = [];

	onMount(() => {
		// todo sick animation
		console.log(elements);
	});
</script>

<nav>
	<ul class={$$props.class}>
		{#each Object.entries(paths) as [href, text], index (href)}
			<NavbarLink {href} {text} bind:clientWidth={elements[index]} />
		{/each}
	</ul>
</nav>
