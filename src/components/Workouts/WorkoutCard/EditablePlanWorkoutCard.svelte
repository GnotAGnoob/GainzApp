<script lang="ts">
	import Button from "$components/Atoms/Button/Button.svelte";
	import { dictionary } from "$src/lib/language/dictionary";
	import type { PagePlannedWorkout } from "$src/routes/types";
	import WorkoutModalFormFill from "../WorkoutModalFormFill.svelte";
	import WorkoutCardTemplate from "./WorkoutCardTemplate.svelte";
	import { plannedWorkouts } from "$lib/stores/plannedWorkouts";
	import axios from "axios";
	import toast from "$src/lib/toast";
	import { apiRoutes } from "$src/lib/paths";
	// eslint-disable-next-line max-len
	import InteractiveWorkoutSupersets from "$src/components/Workouts/WorkoutSupersets/InteractiveWorkoutSupersets.svelte";
	import DisplayWorkoutSupersets from "$src/components/Workouts/WorkoutSupersets/DisplayWorkoutSupersets.svelte";

	export let workout: PagePlannedWorkout;
	export let title: number | string;
	export let isInEditMode = false;

	let errorMessage: string | undefined = undefined;
	let workoutCopy = structuredClone(workout);
	let isModalOpen = false;

	const onCancel = () => {
		workoutCopy = structuredClone(workout);
		isInEditMode = false;
	};

	const onConfirm = async () => {
		try {
			const { data: newPlannedWorkout } = await toast.promise(
				axios.put<PagePlannedWorkout>(`${apiRoutes.planWorkout}${workoutCopy.id}`, workoutCopy),
				{
					loading: `${dictionary.UPDATING_WORKOUT}`,
					success: `${dictionary.WORKOUT_SUCCESSFULLY_UPDATED}`,
					error: dictionary.UPDATING_WORKOUT_FAILED,
				},
			);

			workout = newPlannedWorkout;
			workoutCopy = structuredClone(newPlannedWorkout);
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

	const handleModalOpen = () => {
		isModalOpen = true;
	};
</script>

<!-- todo fix dropdown cut by overflow -->
<WorkoutCardTemplate bind:isInEditMode {title} {onCancel} {onDelete} bottomPadding="sm">
	{#if isInEditMode}
		<InteractiveWorkoutSupersets bind:workout={workoutCopy} {onConfirm} {onCancel} {errorMessage} />
	{:else}
		<DisplayWorkoutSupersets {workout} />
		<div class="startWrapper">
			<div class="start">
				<Button type="noBackground_2" fontSize="sm" padding="sm" paddingSide="md" on:click={handleModalOpen}>
					<span>{dictionary.START_WORKOUT}</span>
				</Button>
			</div>
		</div>
		<WorkoutModalFormFill {workout} bind:isOpen={isModalOpen} />
	{/if}
</WorkoutCardTemplate>

<style lang="scss">
	.start {
		margin-top: $space-md;

		&Wrapper {
			margin-inline: auto;
			margin-top: auto;
		}
	}
</style>
