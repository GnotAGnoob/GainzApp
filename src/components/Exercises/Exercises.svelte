<script lang="ts">
	import type { load } from "$src/routes/+page.server";

	export let categories: Awaited<ReturnType<typeof load>>["categories"];
</script>

<div class="categories">
	{#each categories as category (category.category)}
		<section class="category">
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
		</section>
	{/each}
</div>

<style lang="scss">
	.categories {
		display: flex;

		margin-top: $space-md;

		flex-direction: column;

		color: var(--text-secondary);
	}

	.category {
		border-radius: $border;
		background-color: var(--accent-neutral-200);
	}
</style>
