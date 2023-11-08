<script lang="ts">
	import EditableExercise from "../EditableExercise.svelte";
	import type { PageExercise } from "$src/routes/workouts/types";
	import SupersetTemplate from "./SupersetTemplate.svelte";

	export let exercises: PageExercise[] = [];
	export let order: number;

	const onDelete = (index: number) => {
		exercises = exercises.filter((_, i) => i !== index);
	};
</script>

<SupersetTemplate {order} bind:exercises>
	{#each exercises as exercise, index}
		<EditableExercise bind:exercise onDelete={() => onDelete(index)} />
		super sdjtlka
	{/each}
</SupersetTemplate>
