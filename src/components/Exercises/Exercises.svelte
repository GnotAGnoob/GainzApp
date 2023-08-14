<script lang="ts">
	import { dictionary } from "$lib/language/dictionary";
	import type { load } from "./../../routes/+page.server";

	export let categories: Awaited<ReturnType<typeof load>>["categories"];
</script>

<h2>{dictionary.EXERCISES}</h2>
{#each categories as category (category.category)}
	<h3>{category.category}</h3>
	{#each category.exercises as exercise (exercise.name)}
		<h4>{exercise.name}</h4>
		<date>{exercise.bestSet.date}</date>
		{#each exercise.bestSet.sets as bestSet}
			<p>{bestSet.weight} x {bestSet.reps}</p>
		{/each}
		{#each exercise.history as workout}
			<date>{workout.date}</date>
			{#each workout.sets as set}
				<p>{set.weight} x {set.reps}</p>
			{/each}
		{/each}
	{/each}
{/each}
