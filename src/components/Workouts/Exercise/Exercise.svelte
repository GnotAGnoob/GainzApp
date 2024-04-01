<script lang="ts">
	import type { PageCreateSupersetExercise } from "$src/routes/types";

	export let supersetExercise: PageCreateSupersetExercise;
</script>

<span class="exercise">
	<span class="category item">{supersetExercise.exercise.category.name || ""}</span>
	{#if supersetExercise.exercise?.name}
		<span class="item">-</span>
		<span class="item">{supersetExercise.exercise.name}</span>
	{/if}
</span>

<style lang="scss">
	.category {
		font-weight: 700;
	}

	.exercise {
		font-size: $text;

		& > .item:not(:last-child) {
			margin-right: $space-sm;
		}
	}
</style>
