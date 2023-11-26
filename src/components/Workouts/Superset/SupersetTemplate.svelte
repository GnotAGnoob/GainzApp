<script lang="ts">
	import Button from "$components/Atoms/Button/Button.svelte";
	import { MAX_SUPERSET_EXERCISES } from "$src/lib/constants";
	import Icon from "@iconify/svelte";
	import { dictionary } from "$src/lib/language/dictionary";
	import type { PageCreateSupersetExercise } from "$src/routes/workouts/types";
	import ExerciseDropdown from "$components/Workouts/Exercise/ExerciseDropdown.svelte";

	export let supersetExercises: PageCreateSupersetExercise[];
	export let order: number;

	let newSupersetExercise: Partial<PageCreateSupersetExercise> | null = null;

	$: areExercisesFilled = supersetExercises.every(
		(exercise) => exercise.exercise.category.name.length && exercise.exercise.name.length,
	);
	$: disabledText =
		(supersetExercises.length >= MAX_SUPERSET_EXERCISES && dictionary.YOU_CANNOT_CREATE_MORE_ITEMS) ||
		(!areExercisesFilled && dictionary.YOU_HAVE_TO_FILL_ALL_FIELDS);

	const onAddNewExercise = () => {
		newSupersetExercise = {};
	};

	const onConfirmNewExercise = () => {
		if (newSupersetExercise?.exercise?.category && newSupersetExercise?.exercise) {
			supersetExercises = [
				...supersetExercises,
				{
					exercise: newSupersetExercise.exercise,
				},
			];
			newSupersetExercise = null;
		}
	};

	const onCancelNewExercise = () => {
		newSupersetExercise = null;
	};

	// todo smazat cely superset - btn
</script>

<div class="superset">
	<h5 class="title">{order}. {supersetExercises.length > 1 ? "superset" : "exercise"}</h5>
	<div class="exercises">
		<slot />
		{#if newSupersetExercise}
			<div class="input">
				<ExerciseDropdown
					bind:supersetExercise={newSupersetExercise}
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
