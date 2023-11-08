<script lang="ts">
	import Modal from "$components/Modals/Modal.svelte";
	import type { PagePlannedWorkout } from "$src/routes/workouts/types";
	import FillWorkoutSupersets from "./WorkoutSupersets/FillWorkoutSupersets.svelte";

	export let modal: Modal;
	export let workout: PagePlannedWorkout;
</script>

<Modal size="lg" bind:this={modal}>
	<FillWorkoutSupersets {workout} />
</Modal>
