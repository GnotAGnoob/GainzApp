<script lang="ts">
	import Button from "$components/Atoms/Button/Button.svelte";
	import { MAX_SUPERSET_EXERCISES } from "$src/lib/constants";
	import Icon from "@iconify/svelte";
	import EditableExercise from "./EditableExercise.svelte";
	import { dictionary } from "$src/lib/language/dictionary";
	import type { PageExercise, PageSupersetExercise } from "$src/routes/workouts/types";
	import ExerciseDropdown from "./ExerciseDropdown.svelte";

	export let exercises: PageSupersetExercise[] | PageExercise[] = [];
	export let order: number;

	let newExercise: Partial<PageExercise> | null = null;

	$: areExercisesFilled = exercises.every(
		(exercise) => exercise.category.name.length && exercise.exercise.name.length,
	);
	$: disabledText =
		(exercises.length >= MAX_SUPERSET_EXERCISES && dictionary.YOU_CANNOT_CREATE_MORE_ITEMS) ||
		(!areExercisesFilled && dictionary.YOU_HAVE_TO_FILL_ALL_FIELDS);

	const onAddNewExercise = () => {
		newExercise = {};
	};

	const onConfirmNewExercise = () => {
		if (newExercise?.category && newExercise?.exercise) {
			exercises = [
				...exercises,
				{
					category: newExercise.category,
					exercise: newExercise.exercise,
				},
			];
			newExercise = null;
		}
	};

	const onCancelNewExercise = () => {
		newExercise = null;
	};

	const onDelete = (index: number) => {
		exercises = exercises.filter((_, i) => i !== index);
	};

	// todo smazat cely superset - btn
</script>

<div class="superset">
	<h5 class="title">{order}. {exercises.length > 1 ? "superset" : "exercise"}</h5>
	<div class="exercises">
		{#each exercises as exercise, index}
			<EditableExercise bind:exercise onDelete={() => onDelete(index)} />
		{/each}
		{#if newExercise}
			<div class="input">
				<ExerciseDropdown
					bind:exercise={newExercise}
					onCancel={onCancelNewExercise}
					onConfirm={onConfirmNewExercise}
				/>
			</div>
		{/if}
	</div>
	<div class="button">
		<Button
			type="neutral"
			isPaddingSame
			padding="sm"
			on:click={onAddNewExercise}
			disabledTitle={disabledText}
			title={dictionary.ADD_NEW_EXERCISES}
			isFullSize
		>
			<!-- Solar nema normalni plus... -->
			<Icon icon="iconoir:plus" />
		</Button>
	</div>
</div>

<style lang="scss">
	.exercises {
		display: flex;

		flex-direction: column;

		line-height: 1;
	}

	.title {
		font-size: $text-tag;
		font-weight: 700;
		color: var(--text-secondary);
	}

	.superset {
		display: flex;

		flex-direction: column;

		color: var(--accent-neutral-700);
	}

	.input {
		padding-top: $space-xs;
	}

	.button {
		// margin-inline: auto;
		margin-top: $space-sm;
	}
</style>
