<script lang="ts">
	import Scroller from "$src/components/Scroller/Scroller.svelte";
	import type { PageWorkout } from "$src/routes/types";
	import { workoutHistory as workoutHistoryStore } from "$src/lib/stores/workoutHistory";
	import EditableWorkoutCard from "./WorkoutCard/EditableWorkoutCard.svelte";
	import EmptyCard from "../Atoms/EmptyCard.svelte";
	import { dictionary } from "$src/lib/language/dictionary";
	import { flip } from "svelte/animate";
	import { TRANSITION_CONFIG, getFlyTransitionConfig } from "$src/lib/transitions";
	import { fly } from "svelte/transition";

	export let workoutHistory: PageWorkout[] = [];
	workoutHistoryStore.set(workoutHistory);

	const flyConfig = getFlyTransitionConfig();
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
					<div class="editable" animate:flip={TRANSITION_CONFIG} transition:fly={flyConfig}>
						<EditableWorkoutCard {workout} />
					</div>
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

	.editable {
		flex: 1;
	}
</style>
