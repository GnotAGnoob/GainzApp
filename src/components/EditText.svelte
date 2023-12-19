<script lang="ts">
	import Input from "./Atoms/Input.svelte";
	import EditButtons from "./EditButtons.svelte";
	import type { ButtonType } from "./Atoms/Button/types.ts";
	import { dictionary } from "$lib/language/dictionary";

	export let text = "";
	export let isEditButton = false;
	export let onAdd: (() => void) | undefined = undefined;
	export let onConfirm: (newValue: string) => Promise<void>;
	export let onDelete: (() => Promise<void>) | undefined = undefined;
	export let deleteConfirmationText: string | undefined = undefined;

	export let errorMessage: string | null = null;
	export let buttonType: ButtonType | undefined = undefined;
	export let inputSize: "sm" | "md" | "lg" = "md";

	let value = text;
	let isInEditMode = false;

	const handleEditMode = () => {
		errorMessage = null;
		isInEditMode = true;
	};

	const handleConfirm = async () => {
		errorMessage = null;
		isInEditMode = false;

		await onConfirm(value);

		if (errorMessage) {
			value = text;
		}
	};

	const handleCancel = () => {
		errorMessage = null;
		isInEditMode = false;
		value = text;
	};
</script>

<div class="wrapper wrapper_{inputSize}">
	<EditButtons
		onCancel={handleCancel}
		onConfirm={handleConfirm}
		onEditMode={handleEditMode}
		{onDelete}
		{onAdd}
		editTitle={dictionary.EDIT_TEXT}
		deleteTitle={dictionary.DELETE}
		{deleteConfirmationText}
		{isEditButton}
		{buttonType}
	>
		{#if isInEditMode}
			<div class="input"><Input isAlignCenter bind:value size={inputSize} /></div>
		{:else}
			<slot />
		{/if}
	</EditButtons>
	{#if errorMessage}
		<div>
			<p class="error">{errorMessage}</p>
		</div>
	{/if}
</div>

<style lang="scss">
	.wrapper {
		display: flex;

		flex-direction: column;
		align-items: center;
	}

	.input {
		max-width: $space-xxl;

		.wrapper_sm & {
			max-width: $space-xl + $space-lg;
		}
	}

	.error {
		margin-top: $space-xs;

		color: var(--accent-negative-500);
		font-size: $text-subheading;
		font-weight: 700;

		.wrapper_sm & {
			margin-top: 0;
		}
	}
</style>
