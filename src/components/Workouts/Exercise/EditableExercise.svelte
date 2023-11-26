<script lang="ts">
	import EditButtons from "../../EditButtons.svelte";
	import Exercise from "./Exercise.svelte";
	import type { PageCreateSupersetExercise } from "$src/routes/workouts/types";
	import ExerciseDropdown from "./ExerciseDropdown.svelte";
	import { dictionary } from "$lib/language/dictionary";

	export let supersetExercise: PageCreateSupersetExercise;
	export let onDelete: () => void;
	let isInEditMode = !supersetExercise.exercise.category.name.length;

	const onClick = () => {
		isInEditMode = true;
	};

	const turnEditModeOff = () => {
		isInEditMode = false;
	};
</script>

{#if isInEditMode}
	<div class="input">
		<ExerciseDropdown bind:supersetExercise onCancel={turnEditModeOff} onConfirm={turnEditModeOff} />
	</div>
{:else}
	<div class="exercise">
		<button class="button" on:click={onClick}>
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
			/>
		</div>
	</div>
{/if}

<style lang="scss">
	@import "../workouts.scss";

	.exercise {
		display: flex;

		justify-content: space-between;
		align-items: center;
		gap: $space-sm;

		margin-right: -$card-side-padding + $space-sm;
	}

	.button {
		flex: 1;
	}

	.input {
		padding-block: $space-xs $space-xxs;
	}

	.edit {
		align-self: flex-start;
	}
</style>
