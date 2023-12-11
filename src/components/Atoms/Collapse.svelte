<script lang="ts">
	export let isOpen = false;
	export let isContentClickable = false;
	export let isDisabled = false;
	export let isArrowVisible = true;

	let contentElement: HTMLDivElement;

	$: height = contentElement?.scrollHeight ? `${contentElement?.scrollHeight}px` : "auto";

	const onClick = () => {
		isOpen = !isOpen;
	};
</script>

<div>
	{#if $$slots.title}
		<button class="button" on:click={onClick} disabled={isDisabled}>
			<div class="title">
				<slot name="title" />
				<!-- todo arrow -->
			</div>
			{#if isContentClickable}
				<div class="content" class:isOpen bind:this={contentElement} style="--_height: {height}">
					<slot name="content" />
				</div>
			{/if}
		</button>
	{/if}

	{#if !isContentClickable}
		<div class="content" class:isOpen bind:this={contentElement} style="--_height: {height}">
			<slot name="content" />
		</div>
	{/if}
</div>

<style lang="scss">
	.button {
		width: 100%;

		line-height: 1;
	}

	.title {
		display: flex;
	}

	.content {
		height: 0;
		overflow-y: hidden;

		transition: all 0.15s ease-in-out;

		visibility: hidden;

		&.isOpen {
			height: var(--_height, auto);

			visibility: visible;
		}
	}
</style>
