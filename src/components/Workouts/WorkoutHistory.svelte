<script lang="ts">
	import Scroller from "$src/components/Scroller/Scroller.svelte";
	import type { PageWorkout } from "$src/routes/types";
	import { workoutHistory as workoutHistoryStore } from "$src/lib/stores/workoutHistory";
	import EditableWorkoutCard from "./WorkoutCard/EditableWorkoutCard.svelte";
	import EmptyCard from "../Atoms/EmptyCard.svelte";
	import { dictionary } from "$src/lib/language/dictionary";

	export let workoutHistory: PageWorkout[] = [];
	workoutHistoryStore.set(workoutHistory);
</script>

<section class="wrapper">
	{#if $workoutHistoryStore.length}
		<div class="fullWidth">
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
				{/each}
			</Scroller>
		</div>
	{:else}
		<EmptyCard text={dictionary.NO_WORKOUTS} />
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
