<script lang="ts">
	import Icon from "@iconify/svelte";
	import Button from "../Atoms/Button.svelte";
	import ExerciseForm from "./ExerciseForm.svelte";
	import { dictionary } from "$src/lib/language/dictionary";
	import type { ComponentProps } from "svelte";

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	interface $$Props extends ComponentProps<Button> {
		category?: string;
	}

	export let category = "";
	let exerciseFormElement: ExerciseForm;
</script>

<Button
	type="neutral"
	on:click={exerciseFormElement.toggleModal}
	padding="sm"
	fontSize="sm"
	title={dictionary.ADD_NEW_EXERCISES}
	{...$$restProps}
>
	<!-- Solar nema normalni plus... -->
	<Icon icon="iconoir:plus" />
	<slot />
</Button>
<ExerciseForm {category} bind:this={exerciseFormElement} />
