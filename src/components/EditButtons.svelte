<script lang="ts">
	import type { ButtonType } from "./Atoms/Button/types.ts";
	import ExercisesAddButton from "./Exercises/ExercisesAddButton.svelte";
	import Icon from "@iconify/svelte";
	import Button from "./Atoms/Button/Button.svelte";
	import { dictionary } from "$src/lib/language/dictionary";
	import ConfirmationModal from "./Modals/ConfirmationModal.svelte";

	export let category = "";
	export let isAddButton = false;
	export let onEditMode: (() => void) | undefined = undefined;
	export let onConfirm: (() => void) | undefined = undefined;
	export let onDelete: (() => void) | undefined = undefined;
	export let onCancelDelete: (() => void) | undefined = undefined;
	export let deleteConfirmationText: string | undefined = undefined;
	export let deleteTitle: string | undefined = undefined;
	export let editTitle: string | undefined = undefined;
	export let onCancel: (() => void) | undefined = undefined;
	export let buttonType: ButtonType = "noBackground";
	export let isAbsolute = true;
	export let buttonPadding: "xs" | "sm" | "md" | "lg" = "xs";
	export let isPadding = true;
	export let isConfirmButton = true;
	export let isEditButton = true;

	export let isInEditMode = false;
	let modal: ConfirmationModal;

	const handleEditMode = () => {
		isInEditMode = true;

		onEditMode?.();
	};

	const handleConfirm = () => {
		isInEditMode = false;

		onConfirm?.();
	};

	const handleDelete = () => {
		isInEditMode = false;

		onDelete?.();
	};

	const handleCancel = () => {
		isInEditMode = false;

		onCancel?.();
	};
</script>

<div class="wrapper" class:wrapper_padding={isPadding}>
	<slot />
	<div class="editButtons" class:editButtons_absolute={isAbsolute}>
		{#if !isInEditMode || !isEditButton}
			{#if isEditButton}
				<Button
					type={buttonType}
					padding={buttonPadding}
					fontSize="xs"
					title={editTitle}
					isPaddingSame
					on:click={handleEditMode}
				>
					<span class="icon">
						<Icon icon="solar:pen-bold" />
					</span>
				</Button>
			{/if}
			{#if isAddButton}
				<ExercisesAddButton {category} isPaddingSame type={buttonType} />
			{/if}
			{#if onDelete}
				<Button
					type="negativeNoBackground"
					padding={buttonPadding}
					fontSize="md"
					title={deleteTitle}
					isPaddingSame
					on:click={deleteConfirmationText ? modal.showModal : handleDelete}
				>
					<span class="icon icon_medium">
						<Icon icon="solar:trash-bin-trash-linear" />
					</span>
				</Button>
			{/if}
		{:else}
			{#if isConfirmButton}
				<Button
					type="positiveNoBackground"
					padding={buttonPadding}
					fontSize="sm"
					title={dictionary.CONFIRM}
					isPaddingSame
					on:click={handleConfirm}
				>
					<span class="icon icon_larger">
						<Icon icon="iconoir:check" />
					</span>
				</Button>
			{/if}
			<Button
				type="negativeNoBackground"
				padding={buttonPadding}
				fontSize="sm"
				title={dictionary.CANCEL}
				isPaddingSame
				on:click={handleCancel}
			>
				<span class="icon icon_larger icon_plus">
					<Icon icon="iconoir:plus" />
				</span>
			</Button>
		{/if}
	</div>

	{#if deleteConfirmationText}
		<ConfirmationModal
			bind:this={modal}
			text={deleteConfirmationText}
			onConfirm={handleDelete}
			onCancel={onCancelDelete}
		/>
	{/if}
</div>

<style lang="scss">
	.wrapper {
		display: flex;

		position: relative;

		width: max-content;

		align-items: center;

		&_padding {
			padding-inline: $space-sm;
		}
	}

	.editButtons {
		display: flex;

		gap: $space-xxs;

		align-items: center;

		z-index: 10;

		&_absolute {
			position: absolute;
			left: 100%;
		}
	}

	.icon {
		font-size: $icon-sm;
		line-height: 0;

		&_plus {
			transform: rotate(45deg);
		}

		&_medium {
			font-size: $icon-md;
		}

		&_larger {
			font-size: $icon-lg;
		}
	}
</style>
