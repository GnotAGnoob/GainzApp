<script lang="ts">
	import { dictionary } from "$src/lib/language/dictionary";
	import type { PageCreateWorkout, PagePlannedWorkout } from "$src/routes/workouts/types";
	import WorkoutCardTemplate from "./WorkoutCardTemplate.svelte";
	import { plannedWorkouts } from "$lib/stores/plannedWorkouts";
	import axios from "axios";
	import toast from "$src/lib/toast";
	import { apiRoutes } from "$src/lib/paths";
	// eslint-disable-next-line max-len
	import InteractiveWorkoutSupersets from "$src/components/Workouts/WorkoutSupersets/InteractiveWorkoutSupersets.svelte";

	const emptyWorkout: PageCreateWorkout = { supersets: [{ supersetExercises: [] }] };

	export let title: number | string;
	export let onCancel: () => void;
	export let onConfirm: () => void;

	let newWorkout: PageCreateWorkout = structuredClone(emptyWorkout);
	let errorMessage: string | undefined = undefined;

	const handleCancel = () => {
		onCancel();
	};

	const handleConfirm = async () => {
		try {
			const { data: newPlannedWorkout } = await toast.promise(
				axios.post<PagePlannedWorkout>(apiRoutes.planWorkout, newWorkout),
				{
					loading: `${dictionary.CREATING_WORKOUT}`,
					success: `${dictionary.WORKOUT_SUCCESSFULLY_CREATED}`,
					error: dictionary.CREATING_WORKOUT_FAILED,
				},
			);

			$plannedWorkouts = [...$plannedWorkouts, newPlannedWorkout];
			newWorkout = structuredClone(emptyWorkout);
			onConfirm();
		} catch (error) {
			if (axios.isAxiosError(error)) {
				errorMessage = `${error.response?.data}. idk which element/what happened. too lazy to detect errors`;
				return;
			}
			errorMessage = "super unknown error";
		}
	};
</script>

<WorkoutCardTemplate isInEditMode {title} onCancel={handleCancel}>
	<!-- change for fillwourkout superset -->
	<InteractiveWorkoutSupersets
		bind:workout={newWorkout}
		onConfirm={handleConfirm}
		onCancel={handleCancel}
		{errorMessage}
	/>
</WorkoutCardTemplate>
