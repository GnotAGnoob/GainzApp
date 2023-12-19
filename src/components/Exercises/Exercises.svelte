<script lang="ts">
	import type { PageCategory } from "$src/routes/exercises/types";
	import ExerciseCategory from "./ExerciseCategory.svelte";

	export let categories: PageCategory[];
</script>

<div class="categories">
	{#each categories as category (category.id)}
		<ExerciseCategory {category} />
	{/each}
</div>

<style lang="scss">
	.categories {
		display: flex;

		margin-top: $space-md + $space-sm;
		gap: $space-md;

		flex-direction: column;
		align-items: center;
	}
</style>
