<script lang="ts">
	import EditableExercise from "../Exercise/EditableExercise.svelte";
	import type { PageCreateSupersetExercise } from "$src/routes/types";
	import EditableSupersetTemplate from "./EditableSupersetTemplate.svelte";

	export let supersetExercises: PageCreateSupersetExercise[] = [];
	export let order: number;
	export let onDeleteSuperset: () => void;
	export let disabledDeleteText: string | undefined = undefined;

	const onDelete = (index: number) => {
		supersetExercises = supersetExercises.filter((_, i) => i !== index);
	};

	const handleSelectExercise = (supersetExercise: Partial<PageCreateSupersetExercise>) => {
		if (supersetExercise?.exercise?.category && supersetExercise?.exercise) {
			supersetExercises = [
				...supersetExercises,
				{
					exercise: supersetExercise.exercise,
				},
			];
			return null;
		}

		return supersetExercise;
	};
</script>

<EditableSupersetTemplate
	{order}
	bind:supersetExercises
	onSelectExercise={handleSelectExercise}
	{onDeleteSuperset}
	{disabledDeleteText}
>
	{#each supersetExercises as exercise, index}
		<EditableExercise bind:supersetExercise={exercise} onDelete={() => onDelete(index)} />
	{/each}
</EditableSupersetTemplate>
