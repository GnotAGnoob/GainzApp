<script lang="ts">
	import type { PageExercise } from "$src/routes/workouts/types";

	export let exercise: PageExercise;
</script>

<div class="exercise">
	<span class="category">{exercise.category.name || ""}</span>
	{#if exercise.exercise?.name}
		<span>-</span>
		<span>{exercise.exercise.name}</span>
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
