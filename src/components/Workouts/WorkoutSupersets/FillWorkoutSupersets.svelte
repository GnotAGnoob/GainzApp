<script lang="ts">
	import type { PageFillWorkout } from "$src/routes/types";
	import WorkoutSupersetsTemplate from "./WorkoutSupersetsTemplate.svelte";
	import FillSuperset from "../Superset/FillSuperset.svelte";
	import { dictionary } from "$lib/language/dictionary";
	import axios from "axios";
	import { apiRoutes } from "$src/lib/paths";
	import { exerciseAdditionalInfo } from "$src/lib/stores/exerciseAddionalInfo";
	import { remapWorkout } from "$src/lib/remaps";
	import { TRANSITION_CONFIG } from "$src/lib/transitions";
	import { fade } from "svelte/transition";
	import { flip } from "svelte/animate";
	import { onMount } from "svelte";

	export let workout: PageFillWorkout;
	export let overrideOnCancel: (() => void) | undefined = undefined;
	export let onConfirm: () => void;
	export let errorMessage: string | undefined;
	export let isLoading = false;

	let isFetching = false;
	let isScrollToView = false;
	let workoutCopy = structuredClone(workout);

	$: isSomeSetEmpty = workout.supersets.some((superset) =>
		superset.supersetExercises.some(
			(supersetExercise) =>
				!supersetExercise.sets?.length ||
				supersetExercise.sets.some((set) => !set.repetition.length || !set.weight.length),
		),
	);

	let supersetLength = workout.supersets.length;

	let isLastOpenEdit = false;
	$: {
		if (
			supersetLength !== workout.supersets.length &&
			!workout.supersets[workout.supersets.length - 1].supersetExercises.length
		) {
			isLastOpenEdit = true;
		} else {
			isLastOpenEdit = false;
		}
		supersetLength = workout.supersets.length;
	}

	export const onCancel = () => {
		if (isLoading) return;

		workout = structuredClone(workoutCopy);
	};

	const onDeleteSuperset = (index: number) => {
		if (isLoading || workout.supersets.length === 1) return;

		workout.supersets = workout.supersets.filter((_, i) => i !== index);
	};

	export const fetchAdditionalData = async () => {
		if (isFetching) return;

		const exerciseIds = new Set<number>();

		workout.supersets.forEach((superset) => {
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

			workout = remapWorkout(workout, $exerciseAdditionalInfo);
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

	$: if (workout) {
		fetchAdditionalData();
		workoutCopy = remapWorkout(workoutCopy, $exerciseAdditionalInfo);
	}

	onMount(() => {
		isScrollToView = true;
	});
</script>

<WorkoutSupersetsTemplate
	bind:workout
	{onConfirm}
	onCancel={overrideOnCancel || onCancel}
	{errorMessage}
	disableConfirmButtonText={isSomeSetEmpty ? dictionary.YOU_HAVE_HAVE_TO_FILL_ATLEAST_ONE_SET : undefined}
	{isLoading}
>
	{#each workout?.supersets || [] as superset, index (superset.animationId)}
		<!-- todo in transition slide -->
		<div animate:flip={TRANSITION_CONFIG} out:fade={TRANSITION_CONFIG}>
			<FillSuperset
				bind:supersetExercises={superset.supersetExercises}
				order={index + 1}
				{isLoading}
				{isFetching}
				onDeleteSuperset={() => onDeleteSuperset(index)}
				disabledDeleteText={workout.supersets.length <= 1
					? dictionary.YOU_HAVE_TO_HAVE_ATLEAST_ONE_SUPERSET
					: undefined}
				isOnMountOpenEdit={index === workout.supersets.length - 1 && isLastOpenEdit}
				{isScrollToView}
			/>
		</div>
	{/each}
</WorkoutSupersetsTemplate>
