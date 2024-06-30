<script lang="ts">
	import type { Unit } from "$src/db/schema/unit";
	import { categories as categoriesStore } from "$src/lib/stores/categories";
	import { units as unitsStore } from "$src/lib/stores/units";
	import type { PageCategory } from "$src/routes/exercises/types";
	import ExerciseCategory from "./ExerciseCategory.svelte";

	export let categories: PageCategory[];
	export let units: Unit[];

	unitsStore.set(units);
	categoriesStore.set(categories);
</script>

<div class="categories">
	{#each $categoriesStore as category (category.id)}
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
