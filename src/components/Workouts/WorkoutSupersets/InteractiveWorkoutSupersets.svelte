<script lang="ts">
	import type { PageCreateWorkout, PagePlannedWorkout } from "$src/routes/workouts/types";
	import WourkoutSupersetsTemplate from "./WorkoutSupersetsTemplate.svelte";
	import EditableSuperset from "../Superset/EditableSuperset.svelte";

	export let workout: PageCreateWorkout | PagePlannedWorkout;
	export let onCancel: () => void;
	export let onConfirm: () => void;
	export let errorMessage: string | undefined = undefined;
</script>

<WourkoutSupersetsTemplate bind:workout {onConfirm} {onCancel} {errorMessage}>
	{#each workout?.supersets || [] as superset, index}
		<EditableSuperset bind:exercises={superset.supersetExercises} order={index + 1} />
	{/each}
</WourkoutSupersetsTemplate>
