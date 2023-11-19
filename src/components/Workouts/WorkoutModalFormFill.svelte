<script lang="ts">
	import Modal from "$components/Modals/Modal.svelte";
	import type { PagePlannedWorkout } from "$src/routes/workouts/types";
	import FillWorkoutSupersets from "./WorkoutSupersets/FillWorkoutSupersets.svelte";

	export let modal: Modal;
	export let workout: PagePlannedWorkout;

	let fillWorkout: FillWorkoutSupersets;
</script>

<Modal size="lg" bind:this={modal} onClose={fillWorkout?.onCancel}>
	<FillWorkoutSupersets bind:this={fillWorkout} {workout} overrideOnCancel={modal?.closeModal} />
</Modal>
