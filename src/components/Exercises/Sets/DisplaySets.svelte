<script lang="ts">
	import type { SetWeight } from "$src/db/schema/setWeight";
	import type { StylesType } from "$src/lib/types";
	import DisplaySet from "../Set/DisplaySet.svelte";
	import SetsTemplate from "./SetsTemplate.svelte";

	export let sets: SetWeight[];
	export let type: StylesType = "neutral";
</script>

<SetsTemplate>
	{#each sets as set, index (set.id)}
		<DisplaySet {type} setNumber={index + 1} weight={set.weight} repetition={set.repetition} />
	{/each}
</SetsTemplate>
