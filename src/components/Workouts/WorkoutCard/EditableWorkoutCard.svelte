<script lang="ts">
	import { dictionary } from "$src/lib/language/dictionary";
	import type { PageWorkout } from "$src/routes/types";
	import WorkoutCardTemplate from "./WorkoutCardTemplate.svelte";
	import axios from "axios";
	import toast from "$src/lib/toast";
	import { apiRoutes } from "$src/lib/paths";
	import moment from "moment";
	import { workoutHistory } from "$src/lib/stores/workoutHistory";
	// eslint-disable-next-line max-len
	// import InteractiveWorkoutSupersets from "$src/components/Workouts/WorkoutSupersets/InteractiveWorkoutSupersets.svelte";
	// import DisplayWorkoutSupersets from "$src/components/Workouts/WorkoutSupersets/DisplayWorkoutSupersets.svelte";
	import DisplayWorkoutSupersetsWithSets from "../WorkoutSupersets/DisplayWorkoutSupersetsWithSets.svelte";

	export let workout: PageWorkout;
	export let isInEditMode = false;

	// let errorMessage: string | undefined = undefined;
	// let workoutCopy = structuredClone(workout);

	const onCancel = () => {
		// workoutCopy = structuredClone(workout);
		isInEditMode = false;
	};

	// todo
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
		$workoutHistory = $workoutHistory.filter((plannedWorkout) => plannedWorkout.id !== workout.id);

		try {
			const { data } = await toast.promise(
				axios.delete<PageWorkout[]>(`${apiRoutes.completeWorkout}${workout.id}`),
				{
					loading: `${dictionary.DELETING_WORKOUT}`,
					success: `${dictionary.WORKOUT_SUCCESSFULLY_DELETED}`,
					error: dictionary.DELETING_WORKOUT_FAILED,
				},
			);

			$workoutHistory = data;
		} catch (error) {
			workout = oldWorkout;

			if (axios.isAxiosError(error)) {
				// errorMessage = error.response?.data;
				return;
			}

			// @ts-ignore
			// errorMessage = error?.message || dictionary.UNKNOWN_ERROR;
		}
	};
</script>

<WorkoutCardTemplate bind:isInEditMode title={moment(workout.date).format("D. M. Y")} {onCancel} {onDelete}>
	{#if isInEditMode}
		<!-- todo -->
		<!-- <InteractiveWorkoutSupersets workout={workoutCopy} {onConfirm} {onCancel} {errorMessage} /> -->
	{:else}
		<div class="workouts">
			<DisplayWorkoutSupersetsWithSets {workout} />
		</div>
	{/if}
</WorkoutCardTemplate>

<style lang="scss">
	.workouts {
		flex: 1;
		overflow-y: auto;
	}
</style>
