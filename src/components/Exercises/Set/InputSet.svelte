<script lang="ts">
	import Input from "$src/components/Atoms/Input.svelte";
	import type { StylesType } from "$src/lib/types";
	import Set from "./Set.svelte";

	export let setNumber: number;
	export let weight: string;
	export let reps: string;
	export let type: StylesType = "neutral";
</script>

<Set {setNumber} {type}>
	<Input
		class="input"
		slot="weight"
		bind:value={reps}
		isAlignCenter
		widthSize="dynamic"
		isTextColorInherited
		paddingRight="sm"
		paddingLeft="xs"
	>
		<span class="weightText" slot="rightIcon">kg</span>
	</Input>
	<Input
		class="input"
		slot="reps"
		bind:value={weight}
		isAlignCenter
		widthSize="dynamic"
		isTextColorInherited
		paddingRight="xs"
		paddingLeft="sm"
	>
		<span class="times">x</span>
	</Input>
</Set>

<style lang="scss">
	@import "./Set.scss";

	.times {
		margin-top: $space-xs;
	}
</style>
