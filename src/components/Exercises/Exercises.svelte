<script lang="ts">
	import type { load } from "$src/routes/+page.server";
	import Exercise from "./Exercise.svelte";

	// TODO: vylepsit typ
	export let categories: Awaited<ReturnType<typeof load>>["categories"];
</script>

<div class="categories">
	{#each categories as category (category.category)}
		<section>
			<h3 class="categoryTitle">{category.category}</h3>
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
		gap: $space-md;

		flex-direction: column;
	}

	.category {
		display: flex;

		margin-top: $space-sm;
		padding: $space-sm $space-sm;
		border-radius: $border-md;

		flex-direction: column;
		gap: $space-sm;

		background-color: var(--accent-neutral-100);

		&Title {
			text-align: center;
		}

		@media (min-width: $bp-512) {
			display: grid;

			// grid-auto-flow: column;
			grid-template-columns: repeat(2, 1fr);
			align-items: flex-start;
		}

		@media (min-width: $bp-760) {
			display: grid;

			// grid-auto-flow: column;
			grid-template-columns: repeat(3, 1fr);
			align-items: flex-start;
		}

		@media (min-width: $bp-1096) {
			display: grid;

			// grid-auto-flow: column;
			grid-template-columns: repeat(4, 1fr);
			align-items: flex-start;
		}
	}
</style>
