<script lang="ts">
	import Icon from "@iconify/svelte";

	export let isOpen = false;
	export let isContentClickable = false;
	export let isDisabled = false;
	export let arrowSize: "sm" | "md" | "lg" | undefined = undefined;
	export let arrowPosition: "left" | "right" | undefined = undefined;

	let contentElement: HTMLDivElement;

	$: height = contentElement?.scrollHeight ? `${contentElement?.scrollHeight}px` : "auto";

	const onClick = () => {
		isOpen = !isOpen;
	};
</script>

<div class="wrapper" class:isOpen>
	{#if $$slots.title}
		<button class="button" on:click={onClick} disabled={isDisabled}>
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
				<div class="content" bind:this={contentElement} style="--_height: {height}">
					<slot name="content" />
				</div>
				<slot name="footer" />
			{/if}
		</button>
	{/if}

	{#if !isContentClickable}
		<div class="content" bind:this={contentElement} style="--_height: {height}">
			<slot name="content" />
		</div>
		<slot name="footer" />
	{/if}
</div>

<style lang="scss">
	$_transition-timing: 0.15s ease-in-out;

	.wrapper {
		display: flex;

		flex-direction: column;
	}

	.button {
		width: 100%;

		line-height: 1;
	}

	.title {
		display: flex;

		align-items: center;
		gap: $space-xs;

		&_right {
			justify-content: space-between;
		}
	}

	.content {
		height: 0;
		overflow-y: hidden;

		transition: height $_transition-timing;

		visibility: hidden;

		.isOpen & {
			height: var(--_height, auto);

			visibility: visible;
		}
	}

	.icon {
		margin-top: $space-px * 1;

		line-height: 0;
		font-size: $icon-md;
		color: var(--accent-neutral-600);

		transition: transform $_transition-timing;

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
