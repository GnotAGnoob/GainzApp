<script lang="ts">
	import Modal from "$components/Modals/Modal.svelte";
	import type { PagePlannedWorkout } from "$src/routes/workouts/types";
	import WorkoutSupersets from "./WorkoutSupersets/InteractiveWorkoutSupersets.svelte";

	export let modal: Modal;
	export let workout: PagePlannedWorkout;
</script>

<Modal size="lg" bind:this={modal}>
	<WorkoutSupersets {workout} mode={true} />
</Modal>
