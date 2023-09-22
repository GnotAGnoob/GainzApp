<script lang="ts">
	import Exercise from "./Exercise.svelte";

	export let exercises: any[];
	export let order: number;
</script>

<div class="superset">
	<h5 class="title">{order}. {exercises.length > 1 ? "superset" : "exercise"}</h5>
	<div class="exercises">
		{#each exercises as exercise}
			<Exercise {exercise} />
		{/each}
	</div>
</div>

<style lang="scss">
	.exercises {
		display: flex;

		flex-direction: column;

		line-height: 1;
	}

	.title {
		font-size: $text-tag;
		font-weight: 700;
		color: var(--text-secondary);
	}

	.superset {
		display: flex;

		gap: $space-xxs;

		flex-direction: column;

		color: var(--accent-neutral-700);
	}
</style>
