<script lang="ts">
	import type { PageFillWorkout } from "$src/routes/workouts/types";
	import WourkoutSupersetsTemplate from "./WorkoutSupersetsTemplate.svelte";
	import FillSuperset from "../Superset/FillSuperset.svelte";
	import { dictionary } from "$lib/language/dictionary";

	export let workout: PageFillWorkout;
	export let overrideOnCancel: (() => void) | undefined = undefined;
	export let onExerciseSelect: (() => void) | undefined = undefined;
	export let onConfirm: () => void;
	export let errorMessage: string | undefined;
	export let isLoading = false;
	export let isFetching = false;

	const workoutCopy = structuredClone(workout);

	$: isSomeSetEmpty = workout.supersets.some((superset) =>
		superset.supersetExercises.some(
			(supersetExercise) =>
				!supersetExercise.sets?.length ||
				supersetExercise.sets.some((set) => !set.repetition.length || !set.weight.length),
		),
	);

	export const onCancel = () => {
		if (isLoading) return;

		workout = structuredClone(workoutCopy);
	};

	const onDeleteSuperset = (index: number) => {
		if (isLoading || workout.supersets.length === 1) return;

		workout.supersets = workout.supersets.filter((_, i) => i !== index);
	};
</script>

<WourkoutSupersetsTemplate
	bind:workout
	{onConfirm}
	onCancel={overrideOnCancel || onCancel}
	{errorMessage}
	disableConfirmButtonText={isSomeSetEmpty ? dictionary.YOU_HAVE_HAVE_TO_FILL_ATLEAST_ONE_SET : undefined}
	{isLoading}
>
	{#each workout?.supersets || [] as superset, index}
		<FillSuperset
			bind:supersetExercises={superset.supersetExercises}
			order={index + 1}
			{isLoading}
			{isFetching}
			{onExerciseSelect}
			onDeleteSuperset={() => onDeleteSuperset(index)}
			disabledDeleteText={workout.supersets.length <= 1
				? dictionary.YOU_HAVE_TO_HAVE_ATLEAST_ONE_SUPERSET
				: undefined}
		/>
	{/each}
</WourkoutSupersetsTemplate>
