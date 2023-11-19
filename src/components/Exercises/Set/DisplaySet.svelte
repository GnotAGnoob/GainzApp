<script lang="ts">
	import type { StylesType } from "$src/lib/types";
	import Set from "./Set.svelte";

	export let setNumber: number;
	export let weight: number;
	export let repetition: number;
	export let type: StylesType = "info";
</script>

<Set {setNumber} {type}>
	<span class="weight" slot="weight"><span>{weight}</span><span class="weightText">kg</span></span>
	<span class="reps" slot="reps"><span class="times">x</span><span>{repetition}</span></span>
</Set>

<style lang="scss">
	@import "./Set.scss";

	.weight {
		display: flex;

		align-items: center;
		gap: $space-xxs;
	}

	.reps {
		display: flex;

		margin-top: $space-xxs;

		gap: $space-xs;
		align-items: baseline;
		justify-content: space-between;
	}
</style>
