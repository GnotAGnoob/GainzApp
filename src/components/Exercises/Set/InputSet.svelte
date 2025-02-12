<script lang="ts">
	import Input from "$src/components/Atoms/Input.svelte";
	import type { StylesType } from "$src/lib/types";
	import type { KeyboardEventHandler } from "svelte/elements";
	import Set from "./Set.svelte";

	export let setNumber: number;
	export let weight: string;
	export let repetition: string;
	export let type: StylesType = "neutral";
	export let onDelete: (() => void) | undefined = undefined;
	export let onInput: (() => void) | undefined = undefined;
	export let focus: "weight" | "repetition" | undefined = undefined;
	export let isDisabled = false;
	export let isErrorVisualizationDisabled = false;

	const handleDelete: KeyboardEventHandler<HTMLInputElement> = (event) => {
		if ((event.key === "Backspace" || event.key === "Delete") && (!weight.length || !repetition.length)) {
			onDelete?.();
		}
	};

	$: isRepetitionError = !isErrorVisualizationDisabled && (repetition === "0" || !repetition.length);
	$: isWeightError = !isErrorVisualizationDisabled && !weight.length;
</script>

<Set {setNumber} {type} {isDisabled}>
	<Input
		class="input"
		slot="weight"
		bind:value={weight}
		isAlignCenter
		widthSize="dynamic"
		type="inherit"
		paddingRight="sm"
		paddingLeft="xs"
		inputType="float"
		onKeyDown={handleDelete}
		{onInput}
		isError={isWeightError}
		onMountBehaviour={focus === "weight" ? "focus" : "none"}
		{isDisabled}
	>
		<span class="weightText" slot="rightIcon">kg</span>
	</Input>
	<Input
		class="input"
		slot="reps"
		bind:value={repetition}
		isAlignCenter
		widthSize="dynamic"
		type="inherit"
		paddingRight="xs"
		paddingLeft="sm"
		inputType="integer"
		onKeyDown={handleDelete}
		{onInput}
		isError={isRepetitionError}
		onMountBehaviour={focus === "repetition" ? "focus" : "none"}
		{isDisabled}
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
