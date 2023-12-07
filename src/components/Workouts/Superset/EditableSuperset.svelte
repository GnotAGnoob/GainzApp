<script lang="ts">
	import EditableExercise from "../Exercise/EditableExercise.svelte";
	import type { PageCreateSupersetExercise } from "$src/routes/workouts/types";
	import SupersetTemplate from "./SupersetTemplate.svelte";

	export let supersetExercises: PageCreateSupersetExercise[] = [];
	export let order: number;

	const onDelete = (index: number) => {
		supersetExercises = supersetExercises.filter((_, i) => i !== index);
	};

	const onConfirmExercise = (supersetExercise: Partial<PageCreateSupersetExercise>) => {
		if (supersetExercise?.exercise?.category && supersetExercise?.exercise) {
			supersetExercises = [
				...supersetExercises,
				{
					exercise: supersetExercise.exercise,
				},
			];
			return null;
		}

		return supersetExercise;
	};
</script>

<SupersetTemplate {order} bind:supersetExercises {onConfirmExercise}>
	{#each supersetExercises as exercise, index}
		<EditableExercise bind:supersetExercise={exercise} onDelete={() => onDelete(index)} />
	{/each}
</SupersetTemplate>
