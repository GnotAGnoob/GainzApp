<script lang="ts">
	import type { load } from "$src/routes/+page.server";
	import { dictionary } from "$src/lib/language/dictionary";
	import { Collapse } from "@svelteuidev/core";
	import Workout from "./Workout.svelte";
	import History from "./History.svelte";

	// TODO: vylepsit typ
	export let exercise: Awaited<ReturnType<typeof load>>["categories"][0]["exercises"][0];

	let open = false;

	const checkLastWorkoutBest = () => {
		const lastWorkout = exercise.history[exercise.history.length - 1];
		const bestWorkout = exercise.bestWorkout;

		return lastWorkout.sets.every(
			(set, index) => set.weight === bestWorkout.sets[index].weight && set.reps === bestWorkout.sets[index].reps,
		);
	};

	const isLastWorkoutBest = checkLastWorkoutBest();
</script>

<button class="button" on:click={() => (open = !open)}>
	<li class="exercise">
		<h4 class="name">{exercise.name}</h4>
		<div class="workoutsWrapper" class:workoutsWrapper_open={open}>
			{#if isLastWorkoutBest}
				<div>
					<Workout title={dictionary.BEST_AND_LAST} workout={exercise.bestWorkout} type="best" />
				</div>
			{:else}
				<div class="workouts">
					<Workout title={dictionary.BEST} workout={exercise.bestWorkout} type="best" />
					<Workout title={dictionary.LAST} workout={exercise.history[exercise.history.length - 1]} />
				</div>
			{/if}
		</div>
		<Collapse {open} transitionDuration={255}>
			<History workouts={exercise.history} />
		</Collapse>
	</li>
</button>

<!-- {#each exercise.history as workout}
    <date>{workout.date}</date>
    {#each workout.sets as set}
        <p>{set.weight} x {set.reps}</p>
    {/each}
{/each} -->

<style lang="scss">
	@import "./Exercises.scss";

	.button {
		overflow-x: hidden;
	}

	.exercise {
		color: var(--text-secondary);
	}

	.name {
		text-align: center;
		font-size: $text-smallest;
		font-weight: 900;
	}

	.workouts {
		display: grid;

		grid-template-columns: 1fr 1fr;

		&Wrapper {
			position: relative;

			margin-top: $space-xs;

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
