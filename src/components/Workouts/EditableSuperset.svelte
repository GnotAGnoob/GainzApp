<script lang="ts">
	import Button from "$components/Atoms/Button/Button.svelte";
	import { MAX_SUPERSET_EXERCISES } from "$src/lib/constants";
	import Icon from "@iconify/svelte";
	import EditableExercise from "./EditableExercise.svelte";
	import { dictionary } from "$src/lib/language/dictionary";
	import type { PageFullExercise } from "$src/routes/workouts/types";
	import { index } from "drizzle-orm/mysql-core";

	const emptyExercise: PageFullExercise = {};

	let exercises: PageFullExercise[] = [
		{
			category: { name: "category", id: 1 },
			exercise: { name: "name", id: 2 },
		},
		{
			category: { name: "category", id: 1 },
			exercise: { name: "name", id: 2 },
		},
		{
			category: { name: "category", id: 1 },
			exercise: { name: "name", id: 2 },
		},
	];
	export let order: number;

	// let newExercise

	$: areExercisesFilled = exercises.every(
		(exercise) => exercise.category.name.length && exercise.exercise.name.length,
	);
	$: disabledText =
		(exercises.length >= MAX_SUPERSET_EXERCISES && dictionary.YOU_CANNOT_CREATE_MORE_ITEMS) ||
		(!areExercisesFilled && dictionary.YOU_HAVE_TO_FILL_ALL_FIELDS);

	const onAddExercise = () => {
		exercises = [
			...exercises,
			{
				category: { name: "category", id: 1 },
				exercise: { name: "name", id: 2 },
			},
		];
	};

	const onDelete = (index: number) => {
		exercises = exercises.filter((_, i) => i !== index);
	};

	// todo smazat cely superset
</script>

<div class="superset">
	<h5 class="title">{order}. {exercises.length > 1 ? "superset" : "exercise"}</h5>
	<div class="exercises">
		{#each exercises as exercise, index}
			<EditableExercise bind:exercise onDelete={() => onDelete(index)} />
		{/each}
	</div>
	<div class="button">
		<Button
			type="neutral"
			isPaddingSame
			padding="sm"
			on:click={onAddExercise}
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

	.button {
		// margin-inline: auto;
		margin-top: $space-sm;
	}
</style>
