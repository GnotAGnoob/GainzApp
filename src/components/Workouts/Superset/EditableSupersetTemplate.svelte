<script lang="ts">
	import Button from "$components/Atoms/Button/Button.svelte";
	import { MAX_SUPERSET_EXERCISES } from "$src/lib/constants";
	import Icon from "@iconify/svelte";
	import { dictionary } from "$src/lib/language/dictionary";
	import type { PageCreateSupersetExercise } from "$src/routes/workouts/types";
	import ExerciseDropdown from "$components/Workouts/Exercise/ExerciseDropdown.svelte";

	export let supersetExercises: PageCreateSupersetExercise[];
	export let order: number;
	export let isLoading = false;
	export let onConfirmExercise: (
		exercise: Partial<PageCreateSupersetExercise>,
	) => Partial<PageCreateSupersetExercise> | null;

	let newSupersetExercise: Partial<PageCreateSupersetExercise> | null = null;

	$: areExercisesFilled = supersetExercises.every(
		(exercise) => exercise.exercise.category.name.length && exercise.exercise.name.length,
	);
	$: loadingText = isLoading && dictionary.WAITING_FOR_RESPONSE;
	$: disabledText =
		(supersetExercises.length >= MAX_SUPERSET_EXERCISES && dictionary.YOU_CANNOT_CREATE_MORE_ITEMS) ||
		(!areExercisesFilled && dictionary.YOU_HAVE_TO_FILL_ALL_FIELDS) ||
		loadingText;

	$: if (isLoading) {
		newSupersetExercise = null;
	}

	const onAddNewExercise = () => {
		if (isLoading) return;

		newSupersetExercise = {};
	};

	const onConfirmNewExercise = () => {
		if (isLoading || !newSupersetExercise) return;

		newSupersetExercise = onConfirmExercise(newSupersetExercise);
	};

	const onCancelNewExercise = () => {
		if (isLoading) return;

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
