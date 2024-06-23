<script lang="ts">
	import { TRANSITION_CONFIG, thinHorizontal, getFlyTransitionConfig, thinVertical } from "$src/lib/transitions";
	import { fly } from "svelte/transition";

	export let isHorizontal = false;

	let isTransition = false;

	const transition = isHorizontal ? thinHorizontal : thinVertical;

	const startTransition = () => {
		isTransition = true;
	};

	const endTransition = () => {
		isTransition = false;
	};
</script>

<div
	class="wrapper"
	transition:transition={{ ...TRANSITION_CONFIG, duration: 20000 }}
	on:introstart={startTransition}
	on:outrostart={startTransition}
	on:introend={endTransition}
	on:outroend={endTransition}
>
	{#if isTransition}
		<div class="content contentInvisible">
			<slot />
		</div>
	{/if}
	<div
		class="content"
		class:content_transition={isTransition}
		transition:fly={{ ...getFlyTransitionConfig(), duration: 20000 }}
	>
		<slot />
	</div>
</div>

<style lang="scss">
	.wrapper {
		position: relative;

		overflow-x: hidden;
	}

	.content {
		height: 100%;
		width: 100%;

		&_transition {
			position: absolute;
			top: 0;
			left: 0;
		}

		&Invisible {
			opacity: 0;
		}
	}
</style>
