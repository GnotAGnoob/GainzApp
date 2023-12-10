<script lang="ts">
	import Exercise from "../Exercise/Exercise.svelte";
	import type { PageCreateSupersetExercise } from "$src/routes/workouts/types";

	export let supersetExercises: PageCreateSupersetExercise[] = [];
	export let order: number;
</script>

<div class="superset">
	<h5 class="title">{order}. {supersetExercises.length > 1 ? "superset" : "exercise"}</h5>
	<div class="exercises">
		{#each supersetExercises as supersetExercise}
			<Exercise {supersetExercise} />
		{/each}
	</div>
</div>

<style lang="scss">
	.exercises {
		display: flex;

		flex-direction: column;

		gap: $space-xxs;

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
