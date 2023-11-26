<script lang="ts">
	import FillExercise from "../Exercise/FillExercise.svelte";
	import type { PageFillSupersetExercise } from "$src/routes/workouts/types";
	import SupersetTemplate from "./SupersetTemplate.svelte";

	export let supersetExercises: PageFillSupersetExercise[] = [];
	export let order: number;

	const onDelete = (index: number) => {
		supersetExercises = supersetExercises.filter((_, i) => i !== index);
	};
</script>

<SupersetTemplate {order} bind:supersetExercises>
	<div class="container" class:containerCenter={supersetExercises.length < 2}>
		{#each supersetExercises as supersetExercise, index}
			<FillExercise bind:supersetExercise onDelete={() => onDelete(index)} />
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
