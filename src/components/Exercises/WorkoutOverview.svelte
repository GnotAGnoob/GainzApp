<script lang="ts">
	import { dictionary } from "$src/lib/language/dictionary";
	import { Collapse } from "@svelteuidev/core";
	import Workout from "./Workout.svelte";
	import History from "./History.svelte";
	import type { PageDisplaySupersetExercise } from "$src/routes/exercises/types";

	export let bestWorkout: PageDisplaySupersetExercise;
	export let workoutHistory: PageDisplaySupersetExercise[];

	let open = false;
	const lastWorkout = workoutHistory[workoutHistory.length - 1];
	const isEnoughHistory = workoutHistory.length > 1;
</script>

<button class="button" on:click={() => (open = !open)} class:button_historyless={!isEnoughHistory}>
	<li class="exercise">
		<slot />
		<div class="workoutsWrapper" class:workoutsWrapper_open={open}>
			{#if lastWorkout.id === bestWorkout.id}
				<div>
					<Workout title={dictionary.BEST_AND_LAST} workout={bestWorkout} type="positive" />
				</div>
			{:else}
				<div class="workouts">
					<Workout title={dictionary.BEST} workout={bestWorkout} type="positive" />
					<Workout title={dictionary.LAST} workout={lastWorkout} />
				</div>
			{/if}
		</div>
		{#if isEnoughHistory}
			<Collapse {open} transitionDuration={255}>
				<History workouts={workoutHistory} />
			</Collapse>
		{/if}
	</li>
</button>

<style lang="scss">
	@import "./Exercises.scss";

	.button {
		overflow-x: hidden;

		&_historyless {
			pointer-events: none;
		}
	}

	.exercise {
		display: flex;

		flex-direction: column;
		min-width: $min-exercise-width;
		height: 100%;

		color: var(--text-secondary);
	}

	.workouts {
		display: grid;

		grid-template-columns: 1fr 1fr;

		&Wrapper {
			position: relative;

			margin-top: $space-sm;

			z-index: 1;

			&::after {
				content: "";
				position: absolute;

				inset: 50% 0 0 0;

				background-color: #{$background-color-history};
				opacity: 0;

				transition: opacity 255ms ease-in-out;
				z-index: -1;
			}

			&_open::after {
				opacity: 1;
			}
		}
	}
</style>
