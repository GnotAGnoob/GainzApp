<script lang="ts">
	import { dictionary } from "$src/lib/language/dictionary";
	import type { PagePlannedWorkout, PageWorkout } from "$src/routes/workouts/types";
	import WorkoutCardTemplate from "./WorkoutCardTemplate.svelte";
	import { plannedWorkouts } from "$lib/stores/plannedWorkouts";
	import axios from "axios";
	import toast from "$src/lib/toast";
	import { apiRoutes } from "$src/lib/paths";
	import moment from "moment";
	// eslint-disable-next-line max-len
	import InteractiveWorkoutSupersets from "$src/components/Workouts/WorkoutSupersets/InteractiveWorkoutSupersets.svelte";
	import DisplayWorkoutSupersets from "$src/components/Workouts/WorkoutSupersets/DisplayWorkoutSupersets.svelte";
	import DisplayWorkoutSupersetsWithSets from "../WorkoutSupersets/DisplayWorkoutSupersetsWithSets.svelte";

	export let workout: PageWorkout;
	export let isInEditMode = false;

	let errorMessage: string | undefined = undefined;
	let workoutCopy = structuredClone(workout);

	const onCancel = () => {
		workoutCopy = structuredClone(workout);
		isInEditMode = false;
	};

	// const onConfirm = async () => {
	// 	try {
	// 		const { data: newPlannedWorkout } = await toast.promise(
	// 			axios.put<PagePlannedWorkout>(`${apiRoutes.planWorkout}${workoutCopy.id}`, workoutCopy),
	// 			{
	// 				loading: `${dictionary.UPDATING_WORKOUT}`,
	// 				success: `${dictionary.WORKOUT_SUCCESSFULLY_UPDATED}`,
	// 				error: dictionary.UPDATING_WORKOUT_FAILED,
	// 			},
	// 		);

	// 		workoutCopy = structuredClone(newPlannedWorkout);
	// 		workout = newPlannedWorkout;
	// 		isInEditMode = false;
	// 	} catch (error) {
	// 		if (axios.isAxiosError(error)) {
	// 			errorMessage = `${error.response?.data}. idk which element/what happened. too lazy to detect errors`;
	// 			return;
	// 		}
	// 		errorMessage = "super unknown error";
	// 	}
	// };

	const onDelete = async () => {
		const oldWorkout = workout;
		$plannedWorkouts = $plannedWorkouts.filter((plannedWorkout) => plannedWorkout.id !== workout.id);
		try {
			const { data } = await axios.delete<PagePlannedWorkout[]>(`${apiRoutes.planWorkout}${workout.id}`);

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

<WorkoutCardTemplate bind:isInEditMode title={moment(workout.date).format("D. M. Y")} {onCancel} {onDelete}>
	{#if isInEditMode}
		<!-- todo -->
		<!-- <InteractiveWorkoutSupersets workout={workoutCopy} {onConfirm} {onCancel} {errorMessage} /> -->
	{:else}
		<DisplayWorkoutSupersetsWithSets {workout} />
	{/if}
</WorkoutCardTemplate>
