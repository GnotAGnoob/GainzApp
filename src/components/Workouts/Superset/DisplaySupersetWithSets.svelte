<script lang="ts">
	import type { PageSupersetExercise } from "$src/routes/types";
	import ExerciseWithSets from "../Exercise/ExerciseWithSets.svelte";

	export let supersetExercises: PageSupersetExercise[] = [];
	export let order: number;
</script>

<div class="superset">
	<h5 class="title">{order}. {supersetExercises.length > 1 ? "superset" : "exercise"}</h5>
	<div class="exercises">
		{#each supersetExercises as supersetExercise}
			<ExerciseWithSets {supersetExercise} />
		{/each}
	</div>
</div>

<style lang="scss">
	.exercises {
		display: flex;

		flex-direction: column;

		gap: $space-xxs;
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
