<script lang="ts">
	import { insertInsteadRange } from "$lib/texts";
	import { isStringNumber } from "$src/lib/checks";
	import { MAX_TEXT_LENGTH, MAX_WEIGHT_DECIMAL_NUMBERS } from "$src/lib/constants";
	import type { ClipboardEventType, InputEventType, KeyboardEventType, StylesType } from "$src/lib/types";
	import { onMount } from "svelte";
	import type { ClipboardEventHandler, EventHandler, KeyboardEventHandler } from "svelte/elements";
	import { builderActions, getAttrs, type Builder } from "bits-ui";

	export let label: string | undefined = undefined;
	export let value: string | undefined = undefined;
	export let isAlignCenter = false;
	export let size: "sm" | "md" | "lg" = "md";
	export let widthSize: "sm" | "md" | "lg" | "auto" | "dynamic" = "auto";
	export let paddingLeft: "xs" | "sm" | "md" | "lg" | "none" = "sm";
	export let paddingRight: "xs" | "sm" | "md" | "lg" | "none" = "sm";
	export let type: StylesType = "neutral";
	export let isOnMountFocus = false;
	export let inputType: "float" | "integer" | "string" = "string";
	export let isError = false;
	export let onKeyDown: KeyboardEventHandler<HTMLInputElement> | undefined = undefined;
	export let onInput: (() => void) | undefined = undefined;
	export let isDisabled = false;
	export let maximumDecimalPlaces = MAX_WEIGHT_DECIMAL_NUMBERS;
	export let maxLength = MAX_TEXT_LENGTH;
	export let placeholder: string | undefined = undefined;
	export let builders: Builder[] = [];

	$: isDynamicWidth = widthSize === "dynamic";

	let input: HTMLInputElement | null = null;
	let dynamicText: HTMLDivElement | null = null;

	let inputSize = 0;
	let isFirstInput = !value?.length;

	const modes = {
		float: "decimal",
		integer: "numeric",
		string: "text",
	} as const;

	$: inputMode = modes[inputType];

	$: if (value) onInput?.();

	const updateWidthTimeout = () => {
		setTimeout(() => {
			inputSize = dynamicText?.clientWidth || 0;
		});
	};

	$: {
		if (isDynamicWidth && value) {
			updateWidthTimeout();
		}
	}

	onMount(() => {
		if (isDynamicWidth) {
			updateWidthTimeout();
		}

		if (isOnMountFocus) {
			input?.focus();
		}
	});

	const handleNumber = (
		event:
			| KeyboardEventType<HTMLInputElement>
			| ClipboardEventType<HTMLInputElement>
			| InputEventType<HTMLInputElement>,
		selectionStart: number | null,
		selectionEnd: number | null,
		text: string,
	) => {
		if (inputType === "integer") {
			if (text === "." || text === ",") {
				event.preventDefault();
				return;
			}
		}

		if (inputType !== "string") {
			event.preventDefault();

			if (!isStringNumber(text) && ![".", ","].includes(text)) {
				return;
			}

			let newValue = insertInsteadRange(value || "", text, selectionStart, selectionEnd);

			if (inputType === "integer" && newValue.length) {
				newValue = parseInt(newValue).toString();
			} else {
				newValue = newValue.replace(",", ".");

				const splittedNewValue = newValue.split(".");

				if (
					(splittedNewValue.length > 1 && splittedNewValue[1].length > maximumDecimalPlaces) ||
					splittedNewValue.length > 2
				) {
					return;
				}
			}

			if (!isStringNumber(newValue)) {
				const correctedValue = newValue.replace(/^0+/, "");

				if (isStringNumber(correctedValue)) {
					value = correctedValue;

					const target = event.currentTarget;

					if (!target) return;

					setTimeout(() => {
						const cursorPosition = (selectionStart || 1) - 1;
						target.setSelectionRange(cursorPosition, cursorPosition);
					});
				}

				return;
			}

			const target = event.currentTarget;

			if (!target) return;

			const difference = newValue.length - (value?.length || 0);

			setTimeout(() => {
				const cursorPosition = (selectionEnd || 0) + difference;
				target.setSelectionRange(cursorPosition, cursorPosition);
			});

			value = newValue;
		}
	};

	const handleInput = () => {
		isFirstInput = false;

		if (isDynamicWidth) {
			setTimeout(() => (inputSize = dynamicText?.clientWidth || 0));
		}
	};

	const handleBeforeInput: EventHandler<InputEvent, HTMLInputElement> = (event) => {
		handleNumber(event, event.currentTarget.selectionStart, event.currentTarget.selectionEnd, event.data || "");
	};

	const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
		if (event.key === "Backspace" || event.key === "Delete") {
			if (!value?.length) {
				onKeyDown?.(event);
				return;
			}

			let startOffset = 0;
			let endOffset = 0;

			if (event.currentTarget.selectionStart === event.currentTarget.selectionEnd) {
				startOffset = event.key === "Backspace" ? -1 : 0;
				endOffset = event.key === "Delete" ? 1 : 0;
			}
			const selectionStart = event.currentTarget.selectionStart
				? event.currentTarget.selectionStart + startOffset
				: event.currentTarget.selectionStart;
			const selectionEnd =
				event.currentTarget.selectionEnd !== null
					? event.currentTarget.selectionEnd + endOffset
					: event.currentTarget.selectionEnd;

			handleNumber(event, selectionStart, selectionEnd, "");
			return;
		}
	};

	const handlePaste: ClipboardEventHandler<HTMLInputElement> = (event) => {
		const pastedText = event.clipboardData?.getData("text");
		handleNumber(event, event.currentTarget.selectionStart, event.currentTarget.selectionEnd, pastedText || "");
	};
</script>

<div
	class="wrapper wrapper_{size} wrapperWidth_{widthSize} wrapperType_{type}"
	class:wrapper_center={isAlignCenter}
	class:disabled={isDisabled}
>
	{#if label}
		<label for="text" class="label">{label}</label>
	{/if}
	<div
		class="inputWrapper iconPaddingLeft_{paddingLeft} iconPaddingRight_{paddingRight}"
		class:inputWrapper_error={isError && !isFirstInput}
	>
		<div class="icon icon_left">
			<slot />
		</div>
		<input
			id="text"
			{...$$restProps}
			class="input"
			class:input_dynamic={isDynamicWidth}
			bind:this={input}
			bind:value
			on:click
			on:mousedown
			on:focus
			on:blur
			on:keyup
			on:input={handleInput}
			on:keydown={handleKeyDown}
			on:beforeinput={handleBeforeInput}
			on:paste={handlePaste}
			maxlength={maxLength}
			autocomplete="off"
			style={isDynamicWidth ? `width: ${inputSize}px` : null}
			disabled={isDisabled}
			type="text"
			inputmode={inputMode}
			{placeholder}
			use:builderActions={{ builders }}
			{...getAttrs(builders)}
		/>
		<div class="icon icon_right">
			<slot name="rightIcon" />
		</div>
		{#if isDynamicWidth}
			<div class="textMirror" bind:this={dynamicText}>{value}</div>
		{/if}
	</div>
</div>

<style lang="scss">
	.wrapper {
		--_icon-left: 0;
		--_icon-left-padding: 0;
		--_icon-right: 0;
		--_icon-right-padding: 0;

		&Width_sm {
			width: $space-lg + $space-md;
		}

		&Width_md {
			width: $space-xl + $space-lg;
		}

		&Width_lg {
			width: $space-xxl;
		}

		&Type {
			&_inherit {
				.input,
				.inputWrapper {
					color: inherit;
				}
			}
		}
	}
	.input {
		width: 100%;
		height: 100%;

		padding-block: $space-sm;
		padding-left: var(--_icon-left-padding);
		padding-right: var(--_icon-right-padding);
		border: none;

		color: var(--text-primary);
		background-color: transparent;
		text-transform: none;

		&_dynamic {
			box-sizing: content-box;

			min-width: 2ch;
		}

		&:focus {
			outline: none;
		}

		.wrapper_sm & {
			font-size: $text-tag;
			padding: 0 $space-xs $space-xxs;
		}

		.wrapper_center & {
			text-align: center;
		}

		&Wrapper {
			--_border-color: var(--accent-neutral-200);
			--_border-height: #{$space-px};

			display: flex;
			position: relative;

			align-items: flex-end;
			gap: $space-sm;

			color: var(--text-secondary);

			&::after {
				content: "";

				position: absolute;

				bottom: 0;
				height: var(--_border-height);
				width: 100%;

				background-color: var(--_border-color);
			}

			&:focus-within {
				--_border-color: var(--text-secondary);
			}

			&_error {
				&#{&} {
					--_border-color: var(--accent-negative-400);
				}

				&:focus-within {
					--_border-height: #{$space-px * 2};
				}
			}
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

	.textMirror {
		position: absolute;

		opacity: 0;

		pointer-events: none;

		text-transform: none;
	}

	.icon {
		display: flex;
		position: absolute;

		content: "";

		height: 100%;

		align-items: center;

		&_left {
			left: var(--_icon-left);
		}

		&_right {
			right: var(--_icon-right);
		}

		&Padding {
			&Right {
				&_xs {
					--_icon-right: 0;
					--_icon-right-padding: #{$space-xs};
				}

				&_sm {
					--_icon-right: #{$space-xxs};
					--_icon-right-padding: #{$space-md};
				}

				&_md {
					--_icon-right: #{$space-xs};
					--_icon-right-padding: #{$space-md + $space-sm};
				}

				&_lg {
					--_icon-right: #{$space-sm};
					--_icon-right-padding: #{$space-lg};
				}

				&_none {
					--_icon-right: 0;
					--_icon-right-padding: 0;
				}
			}

			&Left {
				&_xs {
					--_icon-left: 0;
					--_icon-left-padding: #{$space-xs};
				}
				&_sm {
					--_icon-left: 0;
					--_icon-left-padding: #{$space-sm + $space-xs};
				}

				&_md {
					--_icon-left: #{$space-xs};
					--_icon-left-padding: #{$space-md + $space-sm};
				}

				&_lg {
					--_icon-left: #{$space-sm};
					--_icon-left-padding: #{$space-lg};
				}

				&_none {
					--_icon-left: 0;
					--_icon-left-padding: 0;
				}
			}
		}
	}
</style>
