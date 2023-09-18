<script lang="ts">
	import { dictionary } from "$src/lib/language/dictionary";
	import type { PageCategory } from "$src/routes/exercises/types";
	import ExercisesAddButton from "./ExercisesAddButton.svelte";
	import ExerciseCategory from "./ExerciseCategory.svelte";

	export let categories: PageCategory[];
</script>

<div class="button">
	<ExercisesAddButton padding="md" paddingSide="xl" fontSize="md" type="info">
		<span class="buttonInner">{dictionary.ADD_NEW_CATEGORY}</span>
	</ExercisesAddButton>
</div>
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

	.button {
		display: flex;

		margin-top: $space-md;
		margin-inline: auto;

		justify-content: center;
	}
</style>
