<script lang="ts">
	import DisplaySuperset from "../Superset/DisplaySuperset.svelte";
	import type { PagePlannedWorkout } from "$src/routes/workouts/types";

	export let workout: PagePlannedWorkout;
</script>

<div class="supersets">
	{#each workout?.supersets || [] as superset, index}
		<DisplaySuperset exercises={superset.supersetExercises} order={index + 1} />
	{/each}
</div>

<style lang="scss">
	.supersets {
		display: flex;

		flex-direction: column;

		gap: $space-sm + $space-xs;
	}
</style>
