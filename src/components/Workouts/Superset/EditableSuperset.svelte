<script lang="ts">
	import EditableExercise from "../Exercise/EditableExercise.svelte";
	import type { PageCreateSupersetExercise } from "$src/routes/workouts/types";
	import EditableSupersetTemplate from "./EditableSupersetTemplate.svelte";

	export let supersetExercises: PageCreateSupersetExercise[] = [];
	export let order: number;
	export let onDeleteSuperset: () => void;
	export let disabledDeleteText: string | undefined = undefined;

	const onDelete = (index: number) => {
		supersetExercises = supersetExercises.filter((_, i) => i !== index);
	};

	const onConfirmExercise = (supersetExercise: Partial<PageCreateSupersetExercise>) => {
		if (supersetExercise?.exercise?.category && supersetExercise?.exercise) {
			supersetExercises = [
				...supersetExercises,
				{
					// todo fix
					unit: { id: 1, name: "kg" },
					exercise: supersetExercise.exercise,
				},
			];
			return null;
		}

		return supersetExercise;
	};
</script>

<EditableSupersetTemplate {order} bind:supersetExercises {onConfirmExercise} {onDeleteSuperset} {disabledDeleteText}>
	{#each supersetExercises as exercise, index}
		<EditableExercise bind:supersetExercise={exercise} onDelete={() => onDelete(index)} />
	{/each}
</EditableSupersetTemplate>
