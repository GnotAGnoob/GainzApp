<script lang="ts">
	import type { ButtonType } from "./Atoms/Button/types.ts";
	import ExercisesAddButton from "./Exercises/ExercisesAddButton.svelte";
	import Icon from "@iconify/svelte";
	import Button from "./Atoms/Button/Button.svelte";
	import { dictionary } from "$src/lib/language/dictionary";

	export let category = "";
	export let isAddButton = false;
	export let onEditMode: () => void;
	export let onConfirm: () => void;
	export let onCancel: () => void;
	export let buttonType: ButtonType = "noBackground";

	let isInEditMode = false;

	const handleEditMode = () => {
		isInEditMode = true;

		onEditMode();
	};

	const handleConfirm = () => {
		isInEditMode = false;

		onConfirm();
	};

	const handleCancel = () => {
		isInEditMode = false;

		onCancel();
	};
</script>

<div class="wrapper">
	<slot />
	<div class="editButtons">
		{#if !isInEditMode}
			<Button
				type={buttonType}
				padding="xs"
				fontSize="xs"
				title={dictionary.ADD_NEW_EXERCISES}
				isPaddingSame
				on:click={handleEditMode}
			>
				<span class="icon">
					<Icon icon="solar:pen-bold" />
				</span>
			</Button>
			{#if isAddButton}
				<ExercisesAddButton {category} isPaddingSame type={buttonType} />
			{/if}
		{:else}
			<Button
				type="positiveNoBackground"
				padding="xs"
				fontSize="sm"
				title={dictionary.ADD_NEW_EXERCISES}
				isPaddingSame
				on:click={handleConfirm}
			>
				<span class="icon icon_larger">
					<Icon icon="iconoir:check" />
				</span>
			</Button>
			<Button
				type="negativeNoBackground"
				padding="xs"
				fontSize="sm"
				title={dictionary.ADD_NEW_EXERCISES}
				isPaddingSame
				on:click={handleCancel}
			>
				<span class="icon icon_larger icon_plus">
					<Icon icon="iconoir:plus" />
				</span>
			</Button>
		{/if}
	</div>
</div>

<style lang="scss">
	.wrapper {
		display: flex;

		position: relative;

		width: max-content;

		align-items: center;

		padding-inline: $space-sm;
	}

	.editButtons {
		display: flex;

		position: absolute;
		left: 100%;

		gap: $space-xxs;

		align-items: center;

		z-index: 10;
	}

	.icon {
		font-size: $icon-sm;
		line-height: 0;

		&_plus {
			transform: rotate(45deg);
		}

		&_larger {
			font-size: $icon-lg;
		}
	}
</style>
