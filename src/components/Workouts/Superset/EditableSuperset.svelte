<script lang="ts">
	import EditableExercise from "../Exercise/EditableExercise.svelte";
	import type { PageCreateSupersetExercise } from "$src/routes/types";
	import EditableSupersetTemplate from "./EditableSupersetTemplate.svelte";
	import { TRANSITION_CONFIG } from "$src/lib/transitions";
	import { fade } from "svelte/transition";
	import { flip } from "svelte/animate";

	export let supersetExercises: PageCreateSupersetExercise[] = [];
	export let order: number;
	export let onDeleteSuperset: () => void;
	export let disabledDeleteText: string | undefined = undefined;
	export let isOnMountOpenEdit = false;
	export let isScrollToView = false;

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
		}
	};
</script>

<EditableSupersetTemplate
	{order}
	bind:supersetExercises
	onSelectExercise={handleSelectExercise}
	{onDeleteSuperset}
	{disabledDeleteText}
	isOnMountOpen={isOnMountOpenEdit}
	{isScrollToView}
>
	{#each supersetExercises as exercise, index (exercise)}
		<div animate:flip={TRANSITION_CONFIG} out:fade={TRANSITION_CONFIG} in:fade={TRANSITION_CONFIG}>
			<EditableExercise bind:supersetExercise={exercise} onDelete={() => onDelete(index)} />
		</div>
	{/each}
</EditableSupersetTemplate>
