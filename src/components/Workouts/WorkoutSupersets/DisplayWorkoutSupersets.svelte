<script lang="ts">
	import Superset from "../Superset.svelte";
	import type { PagePlannedWorkout } from "$src/routes/workouts/types";

	export let workout: PagePlannedWorkout;
</script>

<div class="supersets">
	{#each workout?.supersets || [] as superset, index}
		<Superset exercises={superset.supersetExercises} order={index + 1} />
	{/each}
</div>

<style lang="scss">
	.supersets {
		display: flex;

		flex-direction: column;

		gap: $space-sm + $space-xs;
	}
</style>
