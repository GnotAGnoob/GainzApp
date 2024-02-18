<script lang="ts">
	import FillExercise from "../Exercise/FillExercise.svelte";
	import type { PageFillSupersetExercise } from "$src/routes/types";
	import EditableSupersetTemplate from "./EditableSupersetTemplate.svelte";
	import { exerciseAdditionalInfo } from "$src/lib/stores/exerciseAddionalInfo";

	export let supersetExercises: PageFillSupersetExercise[] = [];
	export let order: number;
	export let isLoading = false;
	export let isFetching = false;
	export let onDeleteSuperset: () => void;
	export let disabledDeleteText: string | undefined = undefined;

	const onDelete = (index: number) => {
		supersetExercises = supersetExercises.filter((_, i) => i !== index);
	};

	const handleConfirmExercise = (supersetExercise: Partial<PageFillSupersetExercise>) => {
		if (supersetExercise?.exercise?.category && supersetExercise?.exercise) {
			const additionalInfo = $exerciseAdditionalInfo.get(supersetExercise.exercise.id);
			supersetExercises = [
				...supersetExercises,
				{
					exercise: {
						...supersetExercise.exercise,
						bestWorkout: additionalInfo?.bestWorkout,
						workoutHistory: additionalInfo?.workoutHistory,
					},
					sets: supersetExercise.sets || [],
				},
			];

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
