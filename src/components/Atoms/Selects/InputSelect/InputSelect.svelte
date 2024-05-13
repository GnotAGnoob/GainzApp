<script lang="ts">
	import Input from "$components/Atoms/Input.svelte";
	import { Combobox } from "bits-ui";
	import type { SelectHandlerType } from "../types";

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
	export let isOpen = isOnMountFocus;
	export let inputValue: string | undefined = undefined;
	export let touchedInput = false;
	export let label: string | undefined = undefined;
	export let isPortalDisabled: boolean | undefined = undefined;

	// todo vyresit, abych nemusel klikat 2x kdyz chci neco jineho
</script>

<Combobox.Root
	{disabled}
	portal={isPortalDisabled ? null : "#modal"}
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
			{isOnMountFocus}
			on:focus={onInputFocus}
			on:blur={onInputBlur}
			value={inputValue}
		/>
	</Combobox.Input>
	<Combobox.Content
		style="z-index: 75; position:absolute"
		{side}
		{sideOffset}
		{align}
		{alignOffset}
		{collisionPadding}
		{sameWidth}
	>
		<div class="options">
			<div class="optionsMain">
				<slot />
			</div>

			<slot name="bottom" />
		</div>
	</Combobox.Content>
</Combobox.Root>

<style lang="scss">
	.options {
		display: flex;

		flex-direction: column;
		max-height: min(80vh, $space-xxxl + $space-xxl);
		overflow: hidden;

		border-bottom-left-radius: $border-sm;
		border-bottom-right-radius: $border-sm;
		box-shadow: $box-shadow;

		background-color: var(--background-color);

		&Main {
			overflow-y: auto;
			flex: 1;
		}
	}
</style>
