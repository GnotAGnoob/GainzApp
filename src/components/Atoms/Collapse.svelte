<script lang="ts">
	import { TRANSITION_CONFIG } from "$src/lib/transitions";
	import Icon from "@iconify/svelte";
	import { slide } from "svelte/transition";

	export let isOpen = false;
	export let isContentClickable = false;
	export let isDisabled = false;
	export let arrowSize: "sm" | "md" | "lg" | undefined = undefined;
	export let arrowPosition: "left" | "right" | undefined = undefined;

	const handleClick = () => {
		isOpen = !isOpen;
	};
</script>

<div class="wrapper" class:isOpen>
	{#if $$slots.title}
		<div class="buttonWrapper">
			<button class="button" on:click={handleClick} disabled={isDisabled} />
			<div class="title" class:title_right={arrowPosition === "right"}>
				{#if arrowPosition === "left"}
					<span class="icon icon_{arrowSize}">
						<Icon icon="solar:alt-arrow-right-bold" />
					</span>
				{/if}
				<slot name="title" />
				{#if arrowPosition === "right"}
					<span class="icon icon_{arrowSize}">
						<Icon icon="solar:alt-arrow-right-bold" />
					</span>
				{/if}
			</div>
			{#if isContentClickable}
				{#if isOpen}
					<div class="content" transition:slide={TRANSITION_CONFIG}>
						<slot name="content" />
					</div>
				{/if}

				<slot name="footer" />
			{/if}
		</div>
	{/if}

	{#if !isContentClickable}
		{#if isOpen}
			<div class="content" transition:slide={TRANSITION_CONFIG}>
				<slot name="content" />
			</div>
		{/if}

		<slot name="footer" />
	{/if}
</div>

<style lang="scss">
	.wrapper {
		display: flex;

		flex-direction: column;

		flex: 1;
	}

	.button {
		position: absolute;

		inset: 0;
		width: 100%;

		z-index: 1;

		&:disabled {
			cursor: default;
		}

		&Wrapper {
			position: relative;
		}
	}

	.title {
		display: flex;

		align-items: center;
		gap: $space-xs;

		&_right {
			justify-content: space-between;
		}
	}

	.icon {
		margin-top: $space-px * 1;

		line-height: 0;
		font-size: $icon-md;
		color: var(--accent-neutral-600);

		.isOpen & {
			transform: rotate(90deg);
		}

		&_sm {
			font-size: $icon-sm;
		}

		&_lg {
			font-size: $icon-lg;
		}
	}
</style>
