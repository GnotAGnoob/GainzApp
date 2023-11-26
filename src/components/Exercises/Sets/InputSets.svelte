<script lang="ts">
	import Scroller from "$components/Scroller/Scroller.svelte";
	import type { StylesType } from "$src/lib/types";
	import type { PageSetWeight } from "$src/routes/workouts/types";
	import InputSet from "../Set/InputSet.svelte";
	import SetsTemplate from "./SetsTemplate.svelte";

	const emptySet: PageSetWeight = {
		repetition: "",
		weight: "",
	};

	export let sets: PageSetWeight[] = [];
	export let type: StylesType = "neutral";

	let newSet = { ...emptySet };

	let scroller: Scroller | null = null;
	let focusOn: "weight" | "repetition" | undefined;
	let currentFocus: "weight" | "repetition" | undefined;

	$: {
		focusOn = currentFocus;
		currentFocus = newSet.weight.length && !newSet.repetition.length ? "repetition" : "weight";
	}

	$: if (newSet.repetition.length && newSet.weight.length) {
		sets.push(newSet);
		newSet = { ...emptySet, weight: newSet.weight };

		scroller?.scrollToEnd();
	}

	const handleDelete = (index: number) => {
		sets = sets.filter((_, i) => i !== index);
	};

	//todo: check if everything is filled and if there is not something half filled
</script>

<Scroller bind:this={scroller} sideFade="large" type="background" bottomPadding="medium" arrowsPosition="full">
	<SetsTemplate>
		{#each sets as set, index}
			<InputSet
				{type}
				setNumber={index + 1}
				bind:weight={set.weight}
				bind:repetition={set.repetition}
				onDelete={() => handleDelete(index)}
				focus={index === sets.length - 1 ? focusOn : undefined}
			/>
		{/each}
		{#key sets.length}
			<InputSet
				{type}
				setNumber={sets.length + 1}
				bind:weight={newSet.weight}
				bind:repetition={newSet.repetition}
			/>
		{/key}
	</SetsTemplate>
</Scroller>
