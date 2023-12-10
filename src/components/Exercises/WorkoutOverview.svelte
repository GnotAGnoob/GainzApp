<script lang="ts">
	import { dictionary } from "$src/lib/language/dictionary";
	import Workout from "./Workout.svelte";
	import History from "./History.svelte";
	import type { PageDisplaySupersetExercise } from "$src/routes/exercises/types";
	import Collapse from "$components/Atoms/Collapse.svelte";

	export let bestWorkout: PageDisplaySupersetExercise;
	export let workoutHistory: PageDisplaySupersetExercise[];

	let isOpen = false;

	const lastWorkout = workoutHistory[workoutHistory.length - 1];
	const isEnoughHistory = workoutHistory.length > 1;
</script>

<div class="exercise" class:isOpen>
	<Collapse isDisabled={!isEnoughHistory} isContentClickable bind:isOpen>
		<div class="title" slot="title">
			<slot />
			<div class="workoutsWrapper" class:workoutsWrapper_open={isOpen}>
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
		</div>

		<div class="content" slot="content">
			{#if isEnoughHistory}
				<History workouts={workoutHistory} />
			{/if}
		</div>
	</Collapse>
</div>

<style lang="scss">
	@import "./Exercises.scss";

	.title,
	.content {
		width: 100%;
	}

	.exercise {
		position: relative;

		min-width: $space-xxl + $space-xl;

		z-index: 1;

		&::after {
			content: "";
			position: absolute;

			inset: 40% 0 10% 0;

			background-color: #{$background-color-history};
			opacity: 0;

			// transition: opacity 0.15s ease-in-out;
			z-index: -1;
		}

		&.isOpen {
			&::after {
				opacity: 1;
			}
		}

		&:not(.isOpen) {
			&::after {
				transition: opacity 0s 0.15s ease-in-out;
			}
		}
	}

	.workouts {
		display: grid;

		grid-template-columns: 1fr 1fr;

		&Wrapper {
			margin-top: $space-sm;
		}
	}
</style>
