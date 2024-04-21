<script lang="ts">
	import Scroller from "$components/Scroller/Scroller.svelte";
	import { MAX_SETS } from "$src/lib/constants";
	import type { StylesType } from "$src/lib/types";
	import type { PageSetWeight } from "$src/routes/types";
	import InputSet from "../Set/InputSet.svelte";
	import SetsTemplate from "./SetsTemplate.svelte";

	const emptySet: PageSetWeight = {
		repetition: "",
		weight: "",
	};

	export let sets: PageSetWeight[];
	export let type: StylesType = "neutral";
	export let initialWeightValue: number | undefined = undefined;

	$: newSet = { ...emptySet, weight: initialWeightValue !== undefined ? `${initialWeightValue}` : emptySet.weight };

	let scroller: Scroller | null = null;
	let focusOn: "weight" | "repetition" | undefined;
	let currentFocus: "weight" | "repetition" | undefined;

	$: isMaxSets = sets.length >= MAX_SETS;

	$: {
		focusOn = currentFocus;
		currentFocus = newSet.weight.length && !newSet.repetition.length ? "repetition" : "weight";
	}

	$: if (newSet.repetition.length && newSet.weight.length && !isMaxSets) {
		sets.push(newSet);
		newSet = { ...emptySet, weight: newSet.weight };

		scroller?.scrollToEnd();
	}

	const handleDelete = (index: number) => {
		sets = sets.toSpliced(index, 1);
	};

	const handleInput = () => {
		scroller?.setOverflowing();
	};
</script>

<Scroller bind:this={scroller} sideFade="large" type="background" bottomPadding="medium" arrowsPosition="full">
	<SetsTemplate>
		{#each sets as set, index (index)}
			<InputSet
				{type}
				setNumber={index + 1}
				bind:weight={set.weight}
				bind:repetition={set.repetition}
				onDelete={() => handleDelete(index)}
				focus={index === sets.length - 1 ? focusOn : undefined}
				onInput={handleInput}
			/>
		{/each}
		{#if !isMaxSets}
			{#key sets.length}
				<InputSet
					type="neutral_3"
					setNumber={sets.length + 1}
					bind:weight={newSet.weight}
					bind:repetition={newSet.repetition}
					onInput={handleInput}
					isErrorVisualizationDisabled
				/>
			{/key}
		{/if}
	</SetsTemplate>
</Scroller>
