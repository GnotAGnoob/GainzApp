<script lang="ts">
	export let exercise = {
		category: "triceps",
		name: "pulldown",
	};
</script>

<div class="exercise">
	<span class="category">{exercise.category || ""}</span>
	{#if exercise.name}
		<span>-</span>
		<span>{exercise.name}</span>
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
