<script lang="ts">
	import type { PageCreateWorkout } from "$src/routes/workouts/types";
	import WourkoutSupersetsTemplate from "./WorkoutSupersetsTemplate.svelte";
	import EditableSuperset from "../Superset/EditableSuperset.svelte";

	export let workout: PageCreateWorkout;
	export let onCancel: () => void;
	export let onConfirm: () => void;
	export let errorMessage: string | undefined = undefined;
</script>

<WourkoutSupersetsTemplate bind:workout {onConfirm} {onCancel} {errorMessage}>
	{#each workout?.supersets || [] as superset, index}
		<EditableSuperset bind:supersetExercises={superset.supersetExercises} order={index + 1} />
	{/each}
</WourkoutSupersetsTemplate>
