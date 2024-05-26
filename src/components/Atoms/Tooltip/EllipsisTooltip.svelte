<script lang="ts">
	import { afterUpdate } from "svelte";
	import Tooltip from "./Tooltip.svelte";

	export let text: string;

	let isEllipsis = false;
	let ellipsisElement: HTMLDivElement;

	afterUpdate(() => {
		if (ellipsisElement.offsetWidth === ellipsisElement.scrollWidth) {
			isEllipsis = false;
			return;
		}

		isEllipsis = true;
	});
</script>

{#if !isEllipsis}
	<div bind:this={ellipsisElement} class="text">{text}</div>
{:else}
	<Tooltip>
		<div bind:this={ellipsisElement} class="text">{text}</div>
		<div slot="tooltip">{text}</div>
	</Tooltip>
{/if}

<style lang="scss">
	.text {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;

		line-height: 1.2;
		font-weight: inherit;
		color: inherit;
	}
</style>
