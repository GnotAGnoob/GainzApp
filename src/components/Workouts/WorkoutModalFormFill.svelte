<script lang="ts">
	import Modal from "$components/Modals/Modal.svelte";
	import { plannedWorkouts } from "$src/lib/stores/plannedWorkouts";
	import { workoutHistory } from "$src/lib/stores/workoutHistory";
	import type { PageFillWorkout, PagePlannedWorkout, PagePlannedWorkouts } from "$src/routes/types";
	import axios from "axios";
	import FillWorkoutSupersets from "./WorkoutSupersets/FillWorkoutSupersets.svelte";
	import { apiRoutes } from "$src/lib/paths";
	import { dictionary } from "$src/lib/language/dictionary";
	import { remapWorkout } from "$src/lib/remaps";
	import { exerciseAdditionalInfo } from "$src/lib/stores/exerciseAddionalInfo";

	export let modal: Modal;
	export let workout: PagePlannedWorkout;

	let fillWorkout: FillWorkoutSupersets;
	let errorMessage: string | undefined;
	let isLoading = false;

	let remappedWorkout: PageFillWorkout = remapWorkout(workout, $exerciseAdditionalInfo);

	// todo fetch loading states everywhere (here is done)
	const onConfirm = async () => {
		isLoading = true;
		try {
			const { data } = await axios.put<PagePlannedWorkouts>(
				apiRoutes.completeWorkout + workout.id,
				remappedWorkout,
			);
			$plannedWorkouts = data.plannedWorkouts;
			$workoutHistory = data.workoutHistory;
			modal?.closeModal();
		} catch (error) {
			if (axios.isAxiosError(error)) {
				errorMessage = `${error.response?.data}. idk which element/what happened. too lazy to detect errors`;
				isLoading = false;

				return;
			}

			errorMessage = "super unknown error";
		}

		isLoading = false;
	};

	const onShowModal = () => {
		fillWorkout?.fetchAdditionalData();
	};

	const onCancel = () => {
		if (isLoading) return;

		fillWorkout?.onCancel();
	};
</script>

<Modal
	size="lg"
	bind:this={modal}
	onClose={onCancel}
	closeDisabledText={isLoading ? dictionary.WAITING_FOR_RESPONSE : undefined}
	{onShowModal}
>
	<FillWorkoutSupersets
		bind:this={fillWorkout}
		bind:workout={remappedWorkout}
		overrideOnCancel={modal?.closeModal}
		{onConfirm}
		{errorMessage}
		{isLoading}
	/>
</Modal>
