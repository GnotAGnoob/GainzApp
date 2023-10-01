<script lang="ts">
	import { MAX_TEXT_LENGTH } from "$src/lib/constants";
	import { onMount } from "svelte";

	export let label: string | undefined = undefined;
	export let value: string;
	export let isAlignCenter = false;
	export let size: "sm" | "md" | "lg" = "md";
	export let isOnMountFocus = false;

	let input: HTMLInputElement | null = null;

	onMount(() => {
		if (isOnMountFocus) {
			input?.focus();
		}
	});
</script>

<span class="wrapper wrapper_{size}" class:wrapper_center={isAlignCenter}>
	{#if label}
		<label for="text" class="label">{label}</label>
	{/if}
	<div class="inputWrapper">
		<div class="icon icon_left">
			<slot />
		</div>
		<input
			id="text"
			{...$$restProps}
			class="input"
			class:input_left={$$slots.default}
			class:input_right={$$slots.rightIcon}
			bind:this={input}
			bind:value
			on:click
			on:mousedown
			on:focus
			on:blur
			on:keyup
			maxlength={MAX_TEXT_LENGTH}
			autocomplete="off"
		/>
		<div class="icon icon_right">
			<slot name="rightIcon" />
		</div>
	</div>
</span>

<style lang="scss">
	.input {
		width: 100%;
		height: 100%;

		padding: 0 $space-sm $space-xs;
		border: none;

		color: var(--text-primary);
		background-color: transparent;
		text-transform: none;

		&_left {
			padding-left: $space-md + $space-sm;
		}

		&_right {
			padding-right: $space-md + $space-sm;
		}

		&:focus {
			outline: none;
		}

		.wrapper_sm & {
			font-size: $text-tag;
			padding: 0 $space-xs $space-xxs;
		}

		&Wrapper {
			display: flex;
			position: relative;

			border-bottom: $space-px solid var(--accent-neutral-200);

			align-items: flex-end;
			gap: $space-sm;

			color: var(--text-secondary);

			&:focus-within {
				border-color: var(--text-secondary);
			}
		}

		.wrapper_center & {
			text-align: center;
		}
	}

	.label {
		display: block;

		margin-left: $space-xs;
		margin-bottom: $space-xs;

		color: var(--text-secondary);
		font-size: $text-subheading;
		text-transform: capitalize;
	}

	.icon {
		display: flex;
		position: absolute;

		content: "";

		height: 100%;

		align-items: center;

		z-index: -1;

		&_left {
			left: $space-xs;
		}

		&_right {
			right: $space-xs;
		}
	}
</style>
