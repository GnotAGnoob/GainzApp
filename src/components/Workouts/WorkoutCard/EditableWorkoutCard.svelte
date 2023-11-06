<script lang="ts">
	import Button from "$components/Atoms/Button/Button.svelte";
	import { dictionary } from "$src/lib/language/dictionary";
	import type { PagePlannedWorkout } from "$src/routes/workouts/types";
	import WorkoutModalFormFill from "../WorkoutModalFormFill.svelte";
	import type Modal from "../../Modals/Modal.svelte";
	import WorkoutCardTemplate from "./WorkoutCardTemplate.svelte";
	import { plannedWorkouts } from "$lib/stores/plannedWorkouts";
	import axios from "axios";
	import toast from "$src/lib/toast";
	import { apiRoutes } from "$src/lib/paths";
	import WorkoutSupersetsTemplate from "$src/components/Workouts/WorkoutSupersets/InteractiveWorkoutSupersets.svelte";
	import DisplayWorkoutSupersets from "$components/Workouts/WorkoutSupersets/DisplayWorkoutSupersets.svelte";

	export let workout: PagePlannedWorkout;
	export let title: number | string;
	export let isInEditMode = false;

	let workoutModal: Modal;

	let errorMessage: string | undefined = undefined;
	let workoutCopy = structuredClone(workout);

	const onCancel = () => {
		workoutCopy = structuredClone(workout);
		isInEditMode = false;
	};

	const onConfirm = async () => {
		try {
			const { data: newPlannedWorkout } = await toast.promise(
				axios.put<PagePlannedWorkout>(`${apiRoutes.workout}${workoutCopy.id}`, workoutCopy),
				{
					loading: `${dictionary.UPDATING_WORKOUT}`,
					success: `${dictionary.WORKOUT_SUCCESSFULLY_UPDATED}`,
					error: dictionary.UPDATING_WORKOUT_FAILED,
				},
			);

			workoutCopy = structuredClone(newPlannedWorkout);
			workout = newPlannedWorkout;
			isInEditMode = false;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				errorMessage = `${error.response?.data}. idk which element/what happened. too lazy to detect errors`;
				return;
			}
			errorMessage = "super unknown error";
		}
	};

	const onDelete = async () => {
		const oldWorkout = workout;
		$plannedWorkouts = $plannedWorkouts.filter((plannedWorkout) => plannedWorkout.id !== workout.id);
		try {
			const { data } = await axios.delete<PagePlannedWorkout[]>(`${apiRoutes.workout}${workout.id}`);

			$plannedWorkouts = data;
		} catch (error) {
			toast.error(dictionary.DELETING_WORKOUT_FAILED);

			workout = oldWorkout;

			if (axios.isAxiosError(error)) {
				errorMessage = error.response?.data;
				return;
			}

			// @ts-ignore
			errorMessage = error?.message || dictionary.UNKNOWN_ERROR;
		}
	};
</script>

<WorkoutCardTemplate bind:isInEditMode {title} {onCancel} {onDelete}>
	{#if isInEditMode}
		<WorkoutSupersetsTemplate workout={workoutCopy} {onConfirm} {onCancel} {errorMessage} />
	{:else}
		<DisplayWorkoutSupersets {workout} />
		<div class="start">
			<Button type="noBackground_2" fontSize="sm" padding="sm" paddingSide="md" on:click={workoutModal.showModal}>
				<span>{dictionary.START_WORKOUT}</span>
			</Button>
		</div>
		<WorkoutModalFormFill bind:modal={workoutModal} {workout} />
	{/if}
</WorkoutCardTemplate>

<style lang="scss">
	.start {
		margin-inline: auto;
		margin-top: auto;
	}
</style>
