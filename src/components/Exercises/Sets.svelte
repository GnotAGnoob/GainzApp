<script lang="ts">
	import type { load } from "$src/routes/+page.server";
	import Set from "./Set/Set.svelte";
	import type { StylesType } from "$src/lib/types";

	export let sets: Awaited<ReturnType<typeof load>>["categories"][0]["exercises"][0]["history"][0]["sets"];
	export let type: StylesType = "neutral";
</script>

<div class="setsWrapper">
	<ol class="sets">
		{#each sets as set, index}
			<Set {type} setNumber={index + 1} weight={set.weight} reps={set.reps} />
		{/each}
	</ol>
</div>

<style lang="scss">
	@import "./Exercises.scss";

	.sets {
		display: grid;

		width: max-content;
		margin: auto;

		grid-auto-columns: 1fr;
		grid-auto-flow: column;

		&Wrapper {
			margin-inline: auto;
		}
	}
</style>
