<script lang="ts">
	import type { OnMountBehaviour } from "./../../types";
	import Input from "$components/Atoms/Input.svelte";
	import { Combobox } from "bits-ui";
	import type { SelectHandlerType } from "../types";
	import { onMount } from "svelte";
	import { slide } from "svelte/transition";
	import { TRANSITION_CONFIG, TRANSITION_DURATION_FAST } from "$src/lib/transitions";

	export let disabled = false;
	export let isMultiChoice = false;
	// prevents scrolling when dropdown is open
	export let isPreventScroll = false;
	export let isCloseOnOutsideClick = true;
	export let isRequired = false;
	export let side: "top" | "right" | "bottom" | "left" = "bottom";
	export let sideOffset = 0;
	export let align: "start" | "center" | "end" = "center";
	export let alignOffset = 0;
	export let collisionPadding = 16;
	export let sameWidth = true;
	export let placeholder: string | undefined = undefined;
	export let onMountBehaviour: OnMountBehaviour = "none";
	export let maxTextLength: number | undefined = undefined;
	export let onSelectedChange: SelectHandlerType<never> = undefined;
	export let onOpenChange: ((isOpen: boolean) => void) | undefined = undefined;
	export let onInputFocus: (() => void) | undefined = undefined;
	export let onInputBlur: (() => void) | undefined = undefined;
	export let inputValue: string | undefined = undefined;
	export let touchedInput = false;
	export let label: string | undefined = undefined;

	let portal: string | null = "#modal";
	let isMounted = false;
	let checkElement: HTMLElement | null = null;
	let isOpen = false;

	onMount(() => {
		isMounted = true;
		isOpen = onMountBehaviour !== "none";
		const modalElement = checkElement?.closest("#modal");

		if (modalElement) {
			portal = null;
		}
	});

	// TODO: fix double click when dropdown is open and click to input
</script>

{#if !isMounted}
	<div bind:this={checkElement} class="check" />
{/if}

<Combobox.Root
	{disabled}
	{portal}
	required={isRequired}
	multiple={isMultiChoice}
	preventScroll={isPreventScroll}
	closeOnOutsideClick={isCloseOnOutsideClick}
	{onSelectedChange}
	{onOpenChange}
	bind:touchedInput
	bind:inputValue
	bind:open={isOpen}
>
	<Combobox.Input asChild let:builder>
		<Input
			{label}
			builders={[builder]}
			{placeholder}
			maxLength={maxTextLength}
			{onMountBehaviour}
			on:focus={onInputFocus}
			on:blur={onInputBlur}
			value={inputValue}
		/>
	</Combobox.Input>
	<Combobox.Content
		style="z-index: 150; position:absolute"
		{side}
		{sideOffset}
		{align}
		{alignOffset}
		{collisionPadding}
		{sameWidth}
		fitViewport
		transition={slide}
		transitionConfig={{ ...TRANSITION_CONFIG, duration: TRANSITION_DURATION_FAST }}
	>
		<div class="optionsWrapper">
			<div class="options">
				<div class="optionsMain">
					<slot />
				</div>
				<slot name="bottom" />
			</div>
		</div>
	</Combobox.Content>
</Combobox.Root>

<style lang="scss">
	.check {
		position: absolute;
	}

	.options {
		display: flex;

		width: 100%;
		flex-direction: column;
		max-height: $space-xxxl + $space-xxl;
		overflow: hidden;

		box-shadow: $box-shadow;

		background-color: var(--background-color);

		&Wrapper {
			display: flex;

			height: inherit;
			max-height: inherit;
		}

		&Main {
			overflow-y: auto;
			flex: 1;
		}

		:global([data-side="top"]) & {
			border-top-left-radius: $border-sm;
			border-top-right-radius: $border-sm;
		}

		:global([data-side="bottom"]) & {
			border-bottom-left-radius: $border-sm;
			border-bottom-right-radius: $border-sm;
		}
	}
</style>
