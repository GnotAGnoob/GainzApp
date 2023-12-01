<script lang="ts">
	import Modal from "$components/Modals/Modal.svelte";
	import { plannedWorkouts } from "$src/lib/stores/plannedWorkouts";
	import { workoutHistory } from "$src/lib/stores/workoutHistory";
	import type { PagePlannedWorkout, PagePlannedWorkouts } from "$src/routes/workouts/types";
	import axios from "axios";
	import FillWorkoutSupersets from "./WorkoutSupersets/FillWorkoutSupersets.svelte";
	import { apiRoutes } from "$src/lib/paths";

	export let modal: Modal;
	export let workout: PagePlannedWorkout;

	let fillWorkout: FillWorkoutSupersets;
	let errorMessage: string | undefined;

	// todo fetch loading states everywhere
	// check what spamming the button does
	const onConfirm = async () => {
		try {
			const { data } = await axios.put<PagePlannedWorkouts>(apiRoutes.completeWorkout + workout.id, workout);
			$plannedWorkouts = data.plannedWorkouts;
			$workoutHistory = data.workoutHistory;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				errorMessage = `${error.response?.data}. idk which element/what happened. too lazy to detect errors`;
				return;
			}

			errorMessage = "super unknown error";
		}
	};
</script>

<Modal size="lg" bind:this={modal} onClose={fillWorkout?.onCancel}>
	<FillWorkoutSupersets
		bind:this={fillWorkout}
		bind:workout
		overrideOnCancel={modal?.closeModal}
		{onConfirm}
		{errorMessage}
	/>
</Modal>
