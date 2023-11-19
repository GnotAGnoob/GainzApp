<script lang="ts">
	import FillExercise from "../Exercise/FillExercise.svelte";
	import type { PageCreateExercise } from "$src/routes/workouts/types";
	import SupersetTemplate from "./SupersetTemplate.svelte";

	export let exercises: PageCreateExercise[] = [];
	export let order: number;

	const onDelete = (index: number) => {
		exercises = exercises.filter((_, i) => i !== index);
	};
</script>

<SupersetTemplate {order} bind:exercises>
	<div class="container" class:containerCenter={exercises.length < 2}>
		{#each exercises as exercise, index}
			<FillExercise bind:exercise onDelete={() => onDelete(index)} />
		{/each}
	</div>
</SupersetTemplate>

<style lang="scss">
	.container {
		display: flex;

		width: 100%;

		flex-direction: row;
		flex-wrap: wrap;
		align-items: flex-start;

		row-gap: $space-xs;
		column-gap: $space-lg;

		&Center {
			justify-content: center;
		}
	}
</style>
