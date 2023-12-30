<script lang="ts">
	import FillExercise from "../Exercise/FillExercise.svelte";
	import type { PageFillSupersetExercise } from "$src/routes/workouts/types";
	import EditableSupersetTemplate from "./EditableSupersetTemplate.svelte";

	export let supersetExercises: PageFillSupersetExercise[] = [];
	export let order: number;
	export let isLoading = false;
	export let isFetching = false;
	export let onExerciseSelect: (() => void) | undefined = undefined;
	export let onDeleteSuperset: () => void;
	export let disabledDeleteText: string | undefined = undefined;

	const onDelete = (index: number) => {
		supersetExercises = supersetExercises.filter((_, i) => i !== index);
	};

	const handleConfirmExercise = (supersetExercise: Partial<PageFillSupersetExercise>) => {
		if (supersetExercise?.exercise?.category && supersetExercise?.exercise) {
			supersetExercises = [
				...supersetExercises,
				{
					exercise: supersetExercise.exercise,
					sets: supersetExercise.sets || [],
				},
			];

			onExerciseSelect?.();
			return null;
		}

		return supersetExercise;
	};
</script>

<EditableSupersetTemplate
	{order}
	bind:supersetExercises
	{isLoading}
	onConfirmExercise={handleConfirmExercise}
	{onDeleteSuperset}
	{disabledDeleteText}
>
	<div class="container" class:containerCenter={supersetExercises.length < 2}>
		{#each supersetExercises as supersetExercise, index}
			<FillExercise bind:supersetExercise onDelete={() => onDelete(index)} {isLoading} {isFetching} />
		{/each}
	</div>
</EditableSupersetTemplate>

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
