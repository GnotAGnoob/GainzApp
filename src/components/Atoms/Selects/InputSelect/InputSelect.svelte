<script lang="ts">
	import Input from "$components/Atoms/Input.svelte";
	import { Combobox } from "bits-ui";
	import type { SelectHandlerType } from "./types";

	// export let dropDownOptions: string[] | undefined = undefined;
	// export let label: string | undefined = undefined;
	// export let value: string;
	// export let onCreateNew: ((value: string) => Promise<void>) | undefined = undefined;
	// export let onSelect: ((index: number) => void) | undefined = undefined;
	// export let onFocus: (() => void) | undefined = undefined;
	// export let onBlur: (() => void) | undefined = undefined;
	// export let isSelect = false;

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
	export let isOnMountFocus = false;
	export let maxTextLength: number | undefined = undefined;
	export let onSelectedChange: SelectHandlerType<never> = undefined;
	export let onOpenChange: ((isOpen: boolean) => void) | undefined = undefined;
	export let onInputFocus: (() => void) | undefined = undefined;
	export let onInputBlur: (() => void) | undefined = undefined;
	export let isOpen = false;
	export let inputValue: string | undefined = undefined;
	export let touchedInput = false;
</script>

<Combobox.Root
	{disabled}
	portal="#modal"
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
			builders={[builder]}
			{placeholder}
			maxLength={maxTextLength}
			{isOnMountFocus}
			on:focus={onInputFocus}
			on:blur={onInputBlur}
			value={inputValue}
		/>
	</Combobox.Input>
	<Combobox.Content style="z-index: 75;" {side} {sideOffset} {align} {alignOffset} {collisionPadding} {sameWidth}>
		<div class="options">
			<slot />
		</div>
	</Combobox.Content>
</Combobox.Root>

<style lang="scss">
	.options {
		max-height: min(80vh, $space-xxxl + $space-xxl);

		overflow-y: auto;

		border-bottom-left-radius: $border-sm;
		border-bottom-right-radius: $border-sm;
		box-shadow: $box-shadow;

		background-color: var(--background-color);
	}
</style>
