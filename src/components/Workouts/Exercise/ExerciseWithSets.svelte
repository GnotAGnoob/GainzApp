<script lang="ts">
	import Collapse from "$src/components/Atoms/Collapse.svelte";
	import DisplaySets from "$src/components/Exercises/Sets/DisplaySets.svelte";
	import { dictionary } from "$src/lib/language/dictionary";
	import type { PageSupersetExercise } from "$src/routes/workouts/types";
	import Exercise from "./Exercise.svelte";

	export let supersetExercise: PageSupersetExercise;
</script>

<Collapse isContentClickable>
	<span slot="title">
		<Exercise {supersetExercise} />
	</span>
	<div slot="content">
		{#if supersetExercise.sets.length}
			<div class="content">
				<DisplaySets sets={supersetExercise.sets} />
			</div>
		{:else}
			{dictionary.IF_YOU_SEE_THIS}
		{/if}
	</div>
</Collapse>

<style lang="scss">
	.content {
		padding-block: $space-xs $space-sm;
	}
</style>
