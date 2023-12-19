<script lang="ts">
	import type { ButtonType } from "./Atoms/Button/types.ts";
	import Icon from "@iconify/svelte";
	import Button from "./Atoms/Button/Button.svelte";
	import { dictionary } from "$src/lib/language/dictionary";
	import ConfirmationModal from "./Modals/ConfirmationModal.svelte";

	export let onAdd: (() => void) | undefined = undefined;
	export let onEditMode: (() => void) | undefined = undefined;
	export let onConfirm: (() => void) | undefined = undefined;
	export let onDelete: (() => void) | undefined = undefined;
	export let onCancelDelete: (() => void) | undefined = undefined;
	export let deleteConfirmationText: string | undefined = undefined;
	export let deleteTitle: string | undefined = undefined;
	export let editTitle: string | undefined = undefined;
	export let addTitle: string | undefined = undefined;
	export let onCancel: (() => void) | undefined = undefined;
	export let buttonType: ButtonType = "noBackground";
	export let isAbsolute = true;
	export let buttonPadding: "xs" | "sm" | "md" | "lg" = "xs";
	export let isPadding = true;
	export let isConfirmButton = true;
	export let isEditButton = true;
	export let disabledText: string | undefined = undefined;
	export let disabledDeleteText: string | undefined = undefined;
	export let disabledAddText: string | undefined = undefined;
	// todo disabled status for buttons

	export let isInEditMode = false;
	let modal: ConfirmationModal;

	const handleEditMode = () => {
		if (disabledText) return;

		isInEditMode = true;

		onEditMode?.();
	};

	const handleConfirm = () => {
		if (disabledText) return;

		isInEditMode = false;

		onConfirm?.();
	};

	const handleDelete = () => {
		if (disabledText || disabledDeleteText) return;

		isInEditMode = false;

		onDelete?.();
	};

	const handleCancel = () => {
		if (disabledText) return;

		isInEditMode = false;

		onCancel?.();
	};

	const handleAdd = () => {
		if (disabledText || disabledAddText) return;

		isInEditMode = false;

		onAdd?.();
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
					disabledTitle={disabledText}
				>
					<span class="icon">
						<Icon icon="solar:pen-bold" />
					</span>
				</Button>
			{/if}
			{#if onAdd}
				<Button
					type={buttonType}
					on:click={handleAdd}
					padding={buttonPadding}
					fontSize="md"
					isPaddingSame
					title={addTitle}
					disabledTitle={disabledText || disabledAddText}
				>
					<!-- Solar nema normalni plus... -->
					<Icon icon="iconoir:plus" />
				</Button>
			{/if}
			{#if onDelete}
				<Button
					type="negativeNoBackground"
					padding={buttonPadding}
					fontSize="md"
					title={deleteTitle}
					isPaddingSame
					on:click={deleteConfirmationText ? modal.showModal : handleDelete}
					disabledTitle={disabledText || disabledDeleteText}
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
					disabledTitle={disabledText}
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
				disabledTitle={disabledText}
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
