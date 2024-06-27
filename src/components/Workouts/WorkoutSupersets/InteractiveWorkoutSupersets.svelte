<script lang="ts">
	import type { PageCreateWorkout } from "$src/routes/types";
	import WorkoutSupersetsTemplate from "./WorkoutSupersetsTemplate.svelte";
	import EditableSuperset from "../Superset/EditableSuperset.svelte";
	import { dictionary } from "$src/lib/language/dictionary";
	import { fade } from "svelte/transition";
	import { TRANSITION_CONFIG, TRANSITION_DURATION_FAST } from "$src/lib/transitions";
	import { flip } from "svelte/animate";
	import { onMount } from "svelte";

	export let workout: PageCreateWorkout;
	export let onCancel: () => void;
	export let onConfirm: () => void;
	export let errorMessage: string | undefined = undefined;

	let supersetLength = workout.supersets.length;
	let isScrollToView = false;

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

	const onDeleteSuperset = (index: number) => {
		if (workout.supersets.length === 1) return;

		workout.supersets = workout.supersets.filter((_, i) => i !== index);
	};

	onMount(() => {
		isScrollToView = true;
	});

	const animationConfig = { ...TRANSITION_CONFIG, duration: TRANSITION_DURATION_FAST };
</script>

<WorkoutSupersetsTemplate bind:workout {onConfirm} {onCancel} {errorMessage} isSameAllowed={false}>
	{#each workout?.supersets || [] as superset, index (superset)}
		<!-- todo in transition slide -->
		<div animate:flip={animationConfig} out:fade={animationConfig}>
			<EditableSuperset
				bind:supersetExercises={superset.supersetExercises}
				order={index + 1}
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
