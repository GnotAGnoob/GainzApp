<script lang="ts">
	import EditableExercise from "./EditableExercise.svelte";
	import type { PageFillSupersetExercise } from "$src/routes/workouts/types";
	import InputSets from "$src/components/Exercises/Sets/InputSets.svelte";
	import WorkoutOverview from "$src/components/Exercises/WorkoutOverview.svelte";
	import { dictionary } from "$src/lib/language/dictionary";
	import Icon from "@iconify/svelte";

	export let supersetExercise: PageFillSupersetExercise;
	export let onDelete: () => void;
	export let isLoading = false;
	export let isFetching = false;

	$: lastWorkout = supersetExercise.workoutHistory?.[0];
</script>

<div class="container">
	<EditableExercise
		bind:supersetExercise
		{onDelete}
		disabledText={isLoading ? dictionary.WAITING_FOR_RESPONSE : undefined}
	/>
	<div class="wrapper">
		{#if supersetExercise.workoutHistory?.length && supersetExercise.bestWorkout}
			<WorkoutOverview
				bestWorkout={supersetExercise.bestWorkout}
				workoutHistory={supersetExercise.workoutHistory}
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
		<InputSets bind:sets={supersetExercise.sets} initialWeightValue={lastWorkout?.sets[0].weight} />
	</div>
</div>

<style lang="scss">
	.container {
		max-width: $space-xxxl + $space-xl;
		width: 100%;
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
