<script lang="ts">
	import type { PageCreateSupersetExercise } from "$src/routes/types";

	export let supersetExercise: PageCreateSupersetExercise;
</script>

<div class="exercise">
	<span class="category">{supersetExercise.exercise.category.name || ""}</span>
	{#if supersetExercise.exercise?.name}
		<span>-</span>
		<span>{supersetExercise.exercise.name}</span>
	{/if}
</div>

<style lang="scss">
	.category {
		font-weight: 700;
	}

	.exercise {
		display: flex;

		gap: $space-sm;
		font-size: $text;
	}
</style>
