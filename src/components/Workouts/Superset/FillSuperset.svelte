<script lang="ts">
	import FillExercise from "../Exercise/FillExercise.svelte";
	import type { PageFillSupersetExercise, PageCreateSupersetExercise } from "$src/routes/types";
	import EditableSupersetTemplate from "./EditableSupersetTemplate.svelte";
	import { exerciseAdditionalInfo } from "$src/lib/stores/exerciseAddionalInfo";
	import { TRANSITION_CONFIG, TRANSITION_DURATION_FAST } from "$src/lib/transitions";
	import { fade } from "svelte/transition";
	import { flip } from "svelte/animate";

	export let supersetExercises: PageFillSupersetExercise[] = [];
	export let order: number;
	export let isLoading = false;
	export let isFetching = false;
	export let onDeleteSuperset: () => void;
	export let disabledDeleteText: string | undefined = undefined;
	export let isOnMountOpenEdit = false;
	export let isScrollToView = false;

	const onDelete = (index: number) => {
		supersetExercises = supersetExercises.filter((_, i) => i !== index);
	};

	const handleSelectExercise = (supersetExercise: Partial<PageCreateSupersetExercise>) => {
		if (supersetExercise?.exercise?.category && supersetExercise?.exercise) {
			const additionalInfo = $exerciseAdditionalInfo.get(supersetExercise.exercise.id);
			supersetExercises = [
				...supersetExercises,
				{
					animationId: Math.random().toString(),
					exercise: {
						...supersetExercise.exercise,
						animationId: Math.random().toString(),
						bestWorkout: additionalInfo?.bestWorkout,
						workoutHistory: additionalInfo?.workoutHistory,
					},
					sets: [],
				},
			];
		}
	};

	const animationConfig = { ...TRANSITION_CONFIG, duration: TRANSITION_DURATION_FAST };
</script>

<EditableSupersetTemplate
	{order}
	bind:supersetExercises
	{isLoading}
	onSelectExercise={handleSelectExercise}
	{onDeleteSuperset}
	{disabledDeleteText}
	isOnMountOpen={isOnMountOpenEdit}
	{isScrollToView}
>
	<div class="container" class:containerCenter={supersetExercises.length < 2}>
		{#each supersetExercises as supersetExercise, index (supersetExercise.animationId)}
			<div class="exercise" animate:flip={animationConfig} transition:fade={animationConfig}>
				<FillExercise
					bind:supersetExercise
					onDelete={() => onDelete(index)}
					{isLoading}
					isFetching={isFetching && !supersetExercise.exercise.workoutHistory}
				/>
			</div>
		{/each}
	</div>
</EditableSupersetTemplate>

<style lang="scss">
	.container {
		display: flex;

		width: 100%;

		flex-direction: row;
		flex-wrap: wrap;
		align-items: stretch;

		justify-content: center;

		row-gap: $space-xs;
		column-gap: $space-lg;

		&Center {
			justify-content: center;
		}
	}

	.exercise {
		display: flex;

		flex: 1;
		justify-content: center;
	}
</style>
