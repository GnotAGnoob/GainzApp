<script lang="ts">
	import EditableExercise from "./EditableExercise.svelte";
	import type { PageCreateSupersetExercise, PageFillSupersetExercise } from "$src/routes/types";
	import InputSets from "$src/components/Exercises/Sets/InputSets.svelte";
	import WorkoutOverview from "$src/components/Exercises/WorkoutOverview.svelte";
	import { dictionary } from "$src/lib/language/dictionary";
	import Icon from "@iconify/svelte";

	export let supersetExercise: PageFillSupersetExercise;
	export let onDelete: () => void;
	export let isLoading = false;
	export let isFetching = false;

	$: lastWorkout = supersetExercise.exercise.workoutHistory?.[0];
	$: lastWorkoutHighestWeight = lastWorkout?.sets.reduce((acc, set) => (set.weight > acc ? set.weight : acc), 0);

	const handleSelect = (newSupersetExercise: PageCreateSupersetExercise) => {
		supersetExercise = {
			...newSupersetExercise,
			sets: supersetExercise.sets,
		};
	};
</script>

<div class="container">
	<EditableExercise
		{supersetExercise}
		onSelect={handleSelect}
		{onDelete}
		disabledText={isLoading ? dictionary.WAITING_FOR_RESPONSE : undefined}
	/>
	<div class="wrapper">
		{#if supersetExercise.exercise.workoutHistory?.length && supersetExercise.exercise.bestWorkout}
			<WorkoutOverview
				bestWorkout={supersetExercise.exercise.bestWorkout}
				workoutHistory={supersetExercise.exercise.workoutHistory}
			/>
		{:else}
			<h5 class="noWorkout">
				{#if isFetching}
					<div class="icon">
						<Icon icon="eos-icons:loading" />
					</div>
				{:else}
					{dictionary.NO_WORKOUT_HISTORY}
				{/if}
			</h5>
		{/if}
		<InputSets bind:sets={supersetExercise.sets} initialWeightValue={lastWorkoutHighestWeight} />
	</div>
</div>

<style lang="scss">
	.container {
		max-width: $space-xxxl + $space-xxl;
		min-width: $space-xxxl;
		width: 100%;

		flex: 1;
	}

	.wrapper {
		display: flex;

		margin-top: $space-xs;

		flex-direction: column;
		gap: $space-md;
	}

	.icon {
		font-size: $icon-xxl;
	}

	.noWorkout {
		display: flex;

		width: 100%;
		height: $space-xl + $space-lg;
		border-radius: $border-md;
		margin: auto;

		align-items: center;
		justify-content: center;

		background-color: var(--accent-neutral-100);
	}
</style>
