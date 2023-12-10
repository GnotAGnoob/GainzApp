<script lang="ts">
	import Scroller from "$src/components/Scroller/Scroller.svelte";
	import type { PageWorkout } from "$src/routes/workouts/types";
	import { workoutHistory as workoutHistoryStore } from "$src/lib/stores/workoutHistory";
	import EditableWorkoutCard from "./WorkoutCard/EditableWorkoutCard.svelte";

	export let workoutHistory: PageWorkout[] = [];
	workoutHistoryStore.set(workoutHistory);
</script>

<section class="wrapper">
	{#if $workoutHistoryStore.length}
		<Scroller
			wrapperTag="ol"
			sideFade="large"
			type="background"
			arrowsPosition="full"
			bottomPadding="medium"
			isScrollReverse
		>
			{#each $workoutHistoryStore as workout (workout.id)}
				<EditableWorkoutCard {workout} />
			{:else}
				<!-- todo empty -->
			{/each}
		</Scroller>
	{/if}
</section>

<style lang="scss">
	.wrapper {
		display: flex;

		flex-direction: column;

		justify-content: center;

		gap: $space-md;
	}
</style>
