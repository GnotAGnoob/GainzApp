<script lang="ts">
	import { insertInsteadRange } from "$lib/texts";
	import { isStringNumber } from "$src/lib/checks";
	import { MAX_TEXT_LENGTH } from "$src/lib/constants";
	import { onMount } from "svelte";

	export let label: string | undefined = undefined;
	export let value: string | undefined = undefined;
	export let isAlignCenter = false;
	export let size: "sm" | "md" | "lg" = "md";
	export let widthSize: "sm" | "md" | "lg" | "auto" | "dynamic" = "auto";
	export let paddingLeft: "xs" | "sm" | "md" | "lg" | "none" = "sm";
	export let paddingRight: "xs" | "sm" | "md" | "lg" | "none" = "sm";
	export let isTextColorInherited = false;
	export let isOnMountFocus = false;
	export let isNumbersOnly = false;

	const isDynamicWidth = widthSize === "dynamic";

	let input: HTMLInputElement | null = null;
	let dynamicText: HTMLDivElement | null = null;

	let inputSize = 0;

	onMount(() => {
		if (isOnMountFocus) {
			input?.focus();
		}
	});

	const changeInputWidth = () => {
		if (isDynamicWidth) {
			setTimeout(() => (inputSize = dynamicText?.clientWidth || 0));
		}
	};

	const handleKeyPress = (event: KeyboardEvent & { currentTarget: HTMLInputElement }) => {
		if (isNumbersOnly) {
			if (
				!isStringNumber(
					insertInsteadRange(
						value || "",
						event.key || "",
						event.currentTarget.selectionStart,
						event.currentTarget.selectionEnd,
					),
				)
			) {
				event.preventDefault();
			}
		}
	};

	const handlePaste = (event: ClipboardEvent & { currentTarget: HTMLInputElement }) => {
		if (isNumbersOnly) {
			const pastedText = event.clipboardData?.getData("text");
			if (
				!isStringNumber(
					insertInsteadRange(
						value || "",
						pastedText || "",
						event.currentTarget.selectionStart,
						event.currentTarget.selectionEnd,
					),
				)
			) {
				event.preventDefault();
			}
		}
	};
</script>

<div
	class="wrapper wrapper_{size} wrapperWidth_{widthSize}"
	class:wrapper_center={isAlignCenter}
	class:wrapper_inheritColor={isTextColorInherited}
>
	{#if label}
		<label for="text" class="label">{label}</label>
	{/if}
	<div class="inputWrapper iconPaddingLeft_{paddingLeft} iconPaddingRight_{paddingRight}">
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
			on:input={changeInputWidth}
			on:keypress={handleKeyPress}
			on:paste={handlePaste}
			maxlength={MAX_TEXT_LENGTH}
			autocomplete="off"
			style={isDynamicWidth ? `width: ${inputSize}px` : null}
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

		&_inheritColor {
			.input,
			.inputWrapper {
				color: inherit;
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
