<script lang="ts">
	import Input from "$components/Atoms/Input.svelte";
	import { Select } from "bits-ui";
	import type { SelectHandlerType } from "../types";
	import Icon from "@iconify/svelte";
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
	export let maxTextLength: number | undefined = undefined;
	export let onSelectedChange: SelectHandlerType<never> = undefined;
	export let onOpenChange: ((isOpen: boolean) => void) | undefined = undefined;
	export let onInputFocus: (() => void) | undefined = undefined;
	export let onInputBlur: (() => void) | undefined = undefined;
	export let isOpen = false;
	export let label: string | undefined = undefined;
	export let selected: string;

	let portal: string | null = "#modal";
	let isMounted = false;
	let checkElement: HTMLElement | null = null;
	const isOpenInitial = isOpen;

	$: {
		isOpen = false;
	}

	onMount(() => {
		isMounted = true;
		isOpen = isOpenInitial;
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

<Select.Root
	{disabled}
	{portal}
	required={isRequired}
	multiple={isMultiChoice}
	preventScroll={isPreventScroll}
	closeOnOutsideClick={isCloseOnOutsideClick}
	{onSelectedChange}
	{onOpenChange}
	typeahead
	bind:open={isOpen}
>
	<Select.Trigger asChild let:builder>
		<div class="input">
			<Input
				readonly={true}
				{label}
				{placeholder}
				maxLength={maxTextLength}
				on:focus={onInputFocus}
				on:blur={onInputBlur}
				value={selected}
				isAlignCenter
				builders={[builder]}
			>
				<div class="icon" slot="rightIcon">
					<Icon icon="solar:alt-arrow-down-linear" />
				</div>
			</Input>
		</div>
	</Select.Trigger>
	<Select.Content
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
	</Select.Content>
</Select.Root>

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

	.input {
		&:focus-within {
			.icon {
				transform: rotate(180deg);
			}
		}

		& :global(input) {
			cursor: pointer;
		}
	}
</style>
