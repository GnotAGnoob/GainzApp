<script lang="ts">
	import EditableExercise from "../Exercise/EditableExercise.svelte";
	import type { PageCreateSupersetExercise } from "$src/routes/workouts/types";
	import SupersetTemplate from "./SupersetTemplate.svelte";

	export let supersetExercises: PageCreateSupersetExercise[] = [];
	export let order: number;

	const onDelete = (index: number) => {
		supersetExercises = supersetExercises.filter((_, i) => i !== index);
	};
</script>

<SupersetTemplate {order} bind:supersetExercises>
	{#each supersetExercises as exercise, index}
		<EditableExercise bind:supersetExercise={exercise} onDelete={() => onDelete(index)} />
	{/each}
</SupersetTemplate>
