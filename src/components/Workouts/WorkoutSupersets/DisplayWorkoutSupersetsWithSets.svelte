<script lang="ts">
	import type { PageWorkout } from "$src/routes/workouts/types";
	import DisplaySupersetWithSets from "../Superset/DisplaySupersetWithSets.svelte";

	export let workout: PageWorkout;
</script>

<div class="supersets">
	{#each workout?.supersets || [] as superset, index}
		<DisplaySupersetWithSets supersetExercises={superset.supersetExercises} order={index + 1} />
	{/each}
</div>

<style lang="scss">
	.supersets {
		display: flex;

		flex-direction: column;

		gap: $space-sm + $space-xs;
	}
</style>
