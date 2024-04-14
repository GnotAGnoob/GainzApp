<script lang="ts">
	import type { PageCreateWorkout } from "$src/routes/types";
	import WourkoutSupersetsTemplate from "./WorkoutSupersetsTemplate.svelte";
	import EditableSuperset from "../Superset/EditableSuperset.svelte";
	import { dictionary } from "$src/lib/language/dictionary";

	export let workout: PageCreateWorkout;
	export let onCancel: () => void;
	export let onConfirm: () => void;
	export let errorMessage: string | undefined = undefined;

	const onDeleteSuperset = (index: number) => {
		if (workout.supersets.length === 1) return;

		workout.supersets = workout.supersets.filter((_, i) => i !== index);
	};
</script>

<WourkoutSupersetsTemplate bind:workout {onConfirm} {onCancel} {errorMessage} isSameAllowed={false}>
	{#each workout?.supersets || [] as superset, index}
		<EditableSuperset
			bind:supersetExercises={superset.supersetExercises}
			order={index + 1}
			onDeleteSuperset={() => onDeleteSuperset(index)}
			disabledDeleteText={workout.supersets.length <= 1
				? dictionary.YOU_HAVE_TO_HAVE_ATLEAST_ONE_SUPERSET
				: undefined}
		/>
	{/each}
</WourkoutSupersetsTemplate>
