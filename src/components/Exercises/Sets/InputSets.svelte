<script lang="ts">
	import Scroller from "$components/Scroller/Scroller.svelte";
	import type { StylesType } from "$src/lib/types";
	import type { PageCreateSetWeight } from "$src/routes/workouts/types";
	import InputSet from "../Set/InputSet.svelte";
	import SetsTemplate from "./SetsTemplate.svelte";

	export let sets: PageCreateSetWeight[] = [];
	export let type: StylesType = "neutral";

	$: setsLastIndex = sets.length - 1;
	$: if (sets.length && sets[setsLastIndex].repetition.length && sets[setsLastIndex].weight.length) {
		sets.push({
			repetition: "",
			weight: sets[setsLastIndex].weight,
		});

		// todo scroll to the end
	}
</script>

<Scroller sideFade="large" type="background" bottomPadding="medium" arrowsPosition="full">
	<SetsTemplate>
		{#each sets as set, index}
			<InputSet {type} setNumber={index + 1} bind:weight={set.weight} bind:repetition={set.repetition} />
		{/each}
	</SetsTemplate>
</Scroller>
