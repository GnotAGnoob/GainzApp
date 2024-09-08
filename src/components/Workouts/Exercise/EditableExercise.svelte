<script lang="ts">
	import EditButtons from "../../EditButtons.svelte";
	import Exercise from "./Exercise.svelte";
	import type { PageCreateSupersetExercise } from "$src/routes/types";
	import ExerciseDropdown from "./ExerciseDropdown.svelte";
	import { dictionary } from "$lib/language/dictionary";

	export let supersetExercise: PageCreateSupersetExercise;
	export let onDelete: () => void;
	export let disabledText: string | undefined = undefined;
	export let onSelect: ((supersetExercise: PageCreateSupersetExercise) => void) | undefined = undefined;
	let isInEditMode = !supersetExercise.exercise.category.name.length;

	$: if (disabledText) {
		isInEditMode = false;
	}

	const onClick = () => {
		if (disabledText) return;

		isInEditMode = true;
	};

	const turnEditModeOff = () => {
		if (disabledText) return;

		isInEditMode = false;
	};

	const handleSelectExercise = (supersetExercise: PageCreateSupersetExercise) => {
		turnEditModeOff();
		onSelect?.(supersetExercise);
	};
</script>

{#if isInEditMode}
	<div class="input">
		<ExerciseDropdown
			bind:supersetExercise
			onCancel={turnEditModeOff}
			onSelect={handleSelectExercise}
			onMountBehaviour="select"
		/>
	</div>
{:else}
	<div class="exercise">
		<button class="button" on:click={onClick} disabled={!!disabledText}>
			<Exercise {supersetExercise} />
		</button>
		<div class="edit">
			<EditButtons
				bind:isInEditMode
				isConfirmButton={false}
				{onDelete}
				deleteTitle={dictionary.DELETE_EXERCISE}
				isAbsolute={false}
				isPadding={false}
				buttonType="noBackground_2"
				{disabledText}
			/>
		</div>
	</div>
{/if}

<style lang="scss">
	@import "../workouts.scss";

	.exercise {
		display: flex;

		justify-content: flex-end;
		align-items: center;
		gap: $space-sm;
	}

	.button {
		flex: 1;

		text-align: left;
	}

	.input {
		padding-block: $space-xs $space-xxs;
	}

	.edit {
		align-self: flex-start;
	}
</style>
