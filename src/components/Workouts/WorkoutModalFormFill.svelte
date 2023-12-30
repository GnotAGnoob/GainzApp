<script lang="ts">
	import Modal from "$components/Modals/Modal.svelte";
	import { plannedWorkouts } from "$src/lib/stores/plannedWorkouts";
	import { workoutHistory } from "$src/lib/stores/workoutHistory";
	import type {
		PageFillWorkout,
		PagePlannedWorkout,
		PagePlannedWorkouts,
		PageSetWeight,
	} from "$src/routes/workouts/types";
	import axios from "axios";
	import FillWorkoutSupersets from "./WorkoutSupersets/FillWorkoutSupersets.svelte";
	import { apiRoutes } from "$src/lib/paths";
	import { dictionary } from "$src/lib/language/dictionary";
	import { exerciseAdditionalInfo } from "$src/lib/stores/exerciseAddionalInfo";

	export let modal: Modal;
	export let workout: PagePlannedWorkout;

	let fillWorkout: FillWorkoutSupersets;
	let errorMessage: string | undefined;
	let isLoading = false;
	let isFetching = false;

	const remapWorkout = (workout: PagePlannedWorkout | PageFillWorkout) => {
		return {
			...workout,
			supersets: workout.supersets.map((superset) => ({
				...superset,
				supersetExercises: superset.supersetExercises.map((supersetExercise) => {
					const key = supersetExercise.exercise.id;
					const additionalInfo = $exerciseAdditionalInfo.get(key);
					let sets: PageSetWeight[] = [];

					if ("sets" in supersetExercise) {
						sets = supersetExercise.sets;
					}

					return {
						...supersetExercise,
						sets,
						exercise: {
							...supersetExercise.exercise,
							bestWorkout: additionalInfo?.bestWorkout,
							workoutHistory: additionalInfo?.workoutHistory,
						},
					};
				}),
			})),
		};
	};

	let remappedWorkout: PageFillWorkout = remapWorkout(workout);

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
			// todo toast
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

	const fetchAdditionalData = async () => {
		if (isFetching) return;

		const exerciseIds = new Set<number>();

		remappedWorkout.supersets.forEach((superset) => {
			superset.supersetExercises.forEach((supersetExercise) => {
				const key = supersetExercise.exercise.id;
				const additionalInfo = $exerciseAdditionalInfo.get(key);

				if (additionalInfo) {
					return;
				}

				exerciseIds.add(supersetExercise.exercise.id);
			});
		});

		if (!exerciseIds.size) return;

		try {
			isFetching = true;
			const { data } = await axios.post(apiRoutes.exercisesWorkoutHistory, Array.from(exerciseIds));

			const newMap: typeof $exerciseAdditionalInfo = new Map();
			for (const item of data) {
				const { id, ...rest } = item;
				newMap.set(item.id, rest);
			}

			$exerciseAdditionalInfo = new Map([...$exerciseAdditionalInfo, ...newMap]);
			remappedWorkout = remapWorkout(remappedWorkout);
		} catch (error) {
			if (axios.isAxiosError(error)) {
				errorMessage = `${error.response?.data}. error while fetching workout history`;
				isLoading = false;

				return;
			}
			errorMessage = "super unknown error";
		}

		isFetching = false;
	};

	const onShowModal = () => {
		fetchAdditionalData();
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
		onExerciseSelect={fetchAdditionalData}
		{onConfirm}
		{errorMessage}
		{isLoading}
		{isFetching}
	/>
</Modal>
