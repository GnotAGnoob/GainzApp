<script lang="ts">
	import DisplaySuperset from "../Superset/DisplaySuperset.svelte";
	import type { PageCreateWorkout } from "$src/routes/workouts/types";

	export let workout: PageCreateWorkout;
</script>

<div class="supersets">
	{#each workout?.supersets || [] as superset, index}
		<DisplaySuperset supersetExercises={superset.supersetExercises} order={index + 1} />
	{/each}
</div>

<style lang="scss">
	.supersets {
		display: flex;

		flex-direction: column;

		gap: $space-sm + $space-xs;
	}
</style>
