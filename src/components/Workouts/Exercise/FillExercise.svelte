<script lang="ts">
	import EditableExercise from "./EditableExercise.svelte";
	import type { PageFillSupersetExercise } from "$src/routes/workouts/types";
	import InputSets from "$src/components/Exercises/Sets/InputSets.svelte";
	import WorkoutOverview from "$src/components/Exercises/WorkoutOverview.svelte";
	import { dictionary } from "$src/lib/language/dictionary";

	export let supersetExercise: PageFillSupersetExercise;
	export let onDelete: () => void;
	export let isLoading = false;

	// todo fix history color
</script>

<div class="container">
	<EditableExercise
		bind:supersetExercise
		{onDelete}
		disabledText={isLoading ? dictionary.WAITING_FOR_RESPONSE : undefined}
	/>
	<!-- todo exercise.workoutHistory.lenght && exercise.bestWorkout  & use actual data-->
	{#if false}
		<WorkoutOverview
			bestWorkout={{
				id: 77,
				date: new Date(),
				sets: [
					{ id: 1, repetition: 1, weight: 1 },
					{ id: 2, repetition: 2, weight: 2 },
				],
			}}
			workoutHistory={[
				{
					id: 77,
					date: new Date(),
					sets: [
						{ id: 1, repetition: 1, weight: 1 },
						{ id: 2, repetition: 2, weight: 2 },
					],
				},
				{
					id: 22,
					date: new Date(),
					sets: [
						{ id: 1, repetition: 1, weight: 1 },
						{ id: 2, repetition: 2, weight: 2 },
					],
				},
			]}
		/>
	{/if}
	<div class="wrapper">
		<WorkoutOverview
			bestWorkout={{
				id: 77,
				date: new Date(),
				sets: [
					{ id: 1, repetition: 10, weight: 1 },
					{ id: 2, repetition: 20, weight: 2 },
				],
			}}
			workoutHistory={[
				{
					id: 2,
					date: new Date(),
					sets: [
						{ id: 1, repetition: 10, weight: 10 },
						{ id: 2, repetition: 20, weight: 10 },
					],
				},
				{
					id: 87,
					date: new Date(),
					sets: [
						{ id: 1, repetition: 10, weight: 10 },
						{ id: 2, repetition: 9, weight: 10 },
					],
				},
				{
					id: 77,
					date: new Date(),
					sets: [
						{ id: 1, repetition: 1, weight: 1 },
						{ id: 2, repetition: 2, weight: 2 },
					],
				},
			]}
		/>
		<InputSets bind:sets={supersetExercise.sets} />
	</div>
</div>

<style lang="scss">
	.container {
		max-width: $space-xxxl + $space-xl;
		width: 100%;
	}

	.wrapper {
		display: flex;

		flex-direction: column;
		gap: $space-md;
	}
</style>
