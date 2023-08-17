<script lang="ts">
	import type { load } from "$src/routes/+page.server";
	import { dictionary } from "$src/lib/language/dictionary";
	import Workout from "./Workout.svelte";

	// TODO: vylepsit typ
	export let exercise: Awaited<ReturnType<typeof load>>["categories"][0]["exercises"][0];
</script>

<li class="exercise">
	<h4>{exercise.name}</h4>
	<div class="workouts">
		<Workout title={dictionary.BEST_WORKOUT} workout={exercise.bestWorkout} type={"best"} />
		<Workout title={dictionary.LAST_WORKOUT} workout={exercise.history[exercise.history.length - 1]} />
	</div>
</li>

<!-- {#each exercise.history as workout}
    <date>{workout.date}</date>
    {#each workout.sets as set}
        <p>{set.weight} x {set.reps}</p>
    {/each}
{/each} -->

<style lang="scss">
	.workouts {
		display: grid;

		margin-top: $space-sm;
		grid-template-columns: 1fr 1fr;
	}
</style>
