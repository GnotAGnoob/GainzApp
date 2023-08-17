<script lang="ts">
	import type { load } from "$src/routes/+page.server";
	import Exercise from "./Exercise.svelte";

	// TODO: vylepsit typ
	export let categories: Awaited<ReturnType<typeof load>>["categories"];
</script>

<div class="categories">
	{#each categories as category (category.category)}
		<section>
			<h3>{category.category}</h3>
			<ul class="category">
				{#each category.exercises as exercise (exercise.name)}
					<Exercise {exercise} />
				{/each}
			</ul>
		</section>
	{/each}
</div>

<style lang="scss">
	.categories {
		display: flex;

		margin-top: $space-sm;

		flex-direction: column;

		color: var(--text-secondary);
	}

	.category {
		margin-top: $space-xs;
		padding: $space-sm $space-sm;
		border-radius: $border-md;

		background-color: var(--accent-neutral-100);
	}
</style>
