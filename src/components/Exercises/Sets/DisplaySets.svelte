<script lang="ts">
	import type { StylesType } from "$src/lib/types";
	import type { PageWorkoutWeightSet } from "$src/routes/exercises/types";
	import DisplaySet from "../Set/DisplaySet.svelte";
	import SetsTemplate from "./SetsTemplate.svelte";

	export let sets: PageWorkoutWeightSet[];
	export let type: StylesType = "neutral";
</script>

<SetsTemplate>
	{#each sets as set, index}
		<DisplaySet {type} setNumber={index + 1} weight={set.weight} repetition={set.repetition} />
	{/each}
</SetsTemplate>
