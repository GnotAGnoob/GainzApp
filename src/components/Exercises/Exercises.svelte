<script lang="ts">
	import { categories as categoriesStore } from "$src/lib/stores/categories";
	import type { PageCategory } from "$src/routes/exercises/types";
	import ExerciseCategory from "./ExerciseCategory.svelte";

	export let categories: PageCategory[];

	categoriesStore.set(categories);
</script>

<div class="categories">
	{#each categories as category (category.id)}
		<ExerciseCategory {category} />
	{/each}
</div>

<style lang="scss">
	.categories {
		display: flex;

		gap: $space-md;

		flex-direction: column;
		align-items: center;
	}
</style>
