<script lang="ts">
	import Icon from "@iconify/svelte";
	import Button from "./Button.svelte";
	import Input from "./Input.svelte";
	import { dictionary } from "$src/lib/language/dictionary";
	import { onMount } from "svelte";

	const MAX_OPTIONS = 20;

	export let dropDownOptions: string[] | undefined = undefined;
	export let label: string;
	export let value: string;
	export let onCreateNew: ((value: string) => Promise<void>) | undefined = undefined;
	export let isSelect = false;
	const readOnly = isSelect && { readonly: true };
	value = isSelect && !value.length ? dropDownOptions?.[0] ?? "" : value;

	let input: HTMLDivElement | null = null;
	let inputElement: HTMLInputElement | null = null;
	let wasInputFocused = false;
	let optionsElement: HTMLDivElement | null = null;

	let isLoading = false;
	$: reduceOptions = dropDownOptions?.slice(0, MAX_OPTIONS);

	const onClick = (index: number) => {
		if (!dropDownOptions) return;

		value = dropDownOptions[index];
	};

	const handleCreateNew = async () => {
		if (!onCreateNew) return;

		try {
			isLoading = true;
			await onCreateNew(value);
			isLoading = false;
		} catch (error) {
			input?.querySelector("input")?.focus();
			isLoading = false;
			return;
		}
	};

	const onInputClick = () => {
		if (!isSelect) return;

		if (wasInputFocused) {
			wasInputFocused = false;
			input?.querySelector("input")?.blur();
		}
	};

	const onInputMouseDown = () => {
		if (!isSelect) return;

		if (document.activeElement === inputElement) {
			wasInputFocused = true;
		}
	};

	const onInputFocus = () => {
		if (!optionsElement) return;

		optionsElement.scrollTop = 0;
	};

	onMount(() => {
		inputElement = input?.querySelector("input") || null;
	});
</script>

<div class="wrapper">
	<div class="input" class:input_select={isSelect} bind:this={input}>
		<Input
			{label}
			{...$$restProps}
			{...readOnly}
			bind:value
			on:click={onInputClick}
			on:mousedown={onInputMouseDown}
			on:focus={onInputFocus}
		>
			<svelte:fragment slot="rightIcon">
				{#if isSelect}
					<div class="icon">
						<Icon icon="solar:alt-arrow-down-linear" />
					</div>
				{/if}
			</svelte:fragment>
		</Input>
	</div>
	{#if reduceOptions?.length}
		<div class="optionsWrapper" class:optionsWrapper_loading={isLoading}>
			<div class="options" bind:this={optionsElement}>
				{#each reduceOptions as option, index}
					<div class="button">
						<Button isFullSize type="background" borderRadius="none" on:click={() => onClick(index)}
							>{option}</Button
						>
					</div>
				{/each}
			</div>
			{#if onCreateNew && value.length && !reduceOptions.includes(value)}
				<Button isFullSize type="neutral" borderRadius="none" on:click={handleCreateNew}>
					{#if isLoading}
						<Icon icon="eos-icons:loading" />
					{/if}
					<span>{dictionary.CREATE} "{value}"</span>
				</Button>
			{/if}
		</div>
	{/if}
</div>

<style lang="scss">
	.wrapper {
		position: relative;

		z-index: 1;

		&:focus-within {
			.optionsWrapper {
				display: block;
			}

			.icon {
				transform: rotate(180deg);
			}
		}
	}

	.icon {
		line-height: 0;
	}

	.options {
		max-height: $space-xxl + $space-xl;

		overflow-y: auto;

		&Wrapper {
			content: "";

			display: none;

			position: absolute;
			width: 100%;

			top: 100%;

			border-bottom-left-radius: $border-sm;
			border-bottom-right-radius: $border-sm;
			box-shadow: $box-shadow;

			overflow-y: hidden;

			z-index: -1;

			&_loading {
				display: block;
			}
		}
	}

	.button {
		&:not(:first-child) {
			border-top: $space-px solid var(--accent-neutral-100);
		}
	}

	.input {
		&_select :global(input) {
			text-align: center;
			cursor: pointer;
		}
	}
</style>
