<script lang="ts">
	import FillExercise from "../Exercise/FillExercise.svelte";
	import type { PageFillSupersetExercise } from "$src/routes/workouts/types";
	import SupersetTemplate from "./SupersetTemplate.svelte";

	export let supersetExercises: PageFillSupersetExercise[] = [];
	export let order: number;
	export let isLoading = false;

	const onDelete = (index: number) => {
		supersetExercises = supersetExercises.filter((_, i) => i !== index);
	};

	const onConfirmExercise = (supersetExercise: Partial<PageFillSupersetExercise>) => {
		if (supersetExercise?.exercise?.category && supersetExercise?.exercise) {
			supersetExercises = [
				...supersetExercises,
				{
					exercise: supersetExercise.exercise,
					sets: supersetExercise.sets || [],
				},
			];
			return null;
		}

		return supersetExercise;
	};
</script>

<SupersetTemplate {order} bind:supersetExercises {isLoading} {onConfirmExercise}>
	<div class="container" class:containerCenter={supersetExercises.length < 2}>
		{#each supersetExercises as supersetExercise, index}
			<FillExercise bind:supersetExercise onDelete={() => onDelete(index)} {isLoading} />
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
