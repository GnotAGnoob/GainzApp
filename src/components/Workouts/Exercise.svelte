<script lang="ts">
	export let exercise = {
		category: { name: "category", id: 1 },
		exercise: { name: "category", id: 2 },
	};
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
