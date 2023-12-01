<script lang="ts">
	import type { PageFillWorkout } from "$src/routes/workouts/types";
	import WourkoutSupersetsTemplate from "./WorkoutSupersetsTemplate.svelte";
	import FillSuperset from "../Superset/FillSuperset.svelte";
	import { dictionary } from "$lib/language/dictionary";

	export let workout: PageFillWorkout;
	export let overrideOnCancel: (() => void) | undefined = undefined;
	export let onConfirm: () => void;
	export let errorMessage: string | undefined;

	const workoutCopy = structuredClone(workout);

	$: isSomeSetEmpty = workout.supersets.some((superset) =>
		superset.supersetExercises.some(
			(supersetExercise) =>
				!supersetExercise.sets?.length ||
				supersetExercise.sets.some((set) => !set.repetition.length || !set.weight.length),
		),
	);

	export const onCancel = () => {
		workout = structuredClone(workoutCopy);
	};
</script>

<WourkoutSupersetsTemplate
	bind:workout
	{onConfirm}
	onCancel={overrideOnCancel || onCancel}
	{errorMessage}
	disableConfirmButtonText={isSomeSetEmpty ? dictionary.YOU_HAVE_HAVE_TO_FILL_ATLEAST_ONE_SET : undefined}
>
	{#each workout?.supersets || [] as superset, index}
		<FillSuperset bind:supersetExercises={superset.supersetExercises} order={index + 1} />
	{/each}
</WourkoutSupersetsTemplate>
