<script lang="ts">
	import { page } from "$app/stores";

	import paths from "$lib/paths";
	import NavbarLink from "./NavbarLink.svelte";
	// import { flip } from "svelte/animate";
	// import { crossfade } from "svelte/transition";
	// import { quintOut } from "svelte/easing";

	// const [send, receive] = crossfade({
	// 	fallback(node) {
	// 		const style = getComputedStyle(node);
	// 		const transform = style.transform === "none" ? "" : style.transform;

	// 		return {
	// 			duration: 100,
	// 			easing: quintOut,
	// 			css: (t) => `
	// 				transform: ${transform} scale(${t});
	// 				opacity: ${t}
	// 			`,
	// 		};
	// 	},
	// });
</script>

<nav>
	<ul class="navigation">
		{#each Object.entries(paths) as [href, text], index (href)}
			<div class="wrapper">
				<NavbarLink {href} {text} {index} />
				<!-- {#each $page.url.pathname === href ? [1] : [] as index (index)}
					<div class="divider" animate:flip in:receive={{ key: 1 }} out:send={{ key: 1 }} />
				{/each} -->
				{#if $page.url.pathname === href}
					<div class="divider" />
				{/if}
			</div>
		{/each}
	</ul>
</nav>

<style lang="scss">
	.navigation {
		display: flex;

		align-items: center;

		gap: $space-lg;
	}

	.wrapper {
		position: relative;
	}

	.divider {
		position: absolute;

		bottom: -$space-xs;
		width: 100%;
		height: $space-xxs;

		background-color: var(--text-primary--hover);

		// @ts-ignore
		view-transition-name: divider;
	}
</style>
