<script lang="ts">
	import SkeletonExercises from "./../../components/Exercises/SkeletonExercises.svelte";
	import { floatedCorner } from "$src/lib/stores/floatedCorner";
	import Exercises from "$src/components/Exercises/Exercises.svelte";
	import Error from "$src/components/Errors/Error.svelte";

	export let data;

	$floatedCorner = ["addExercise"];
</script>

<div class="wrapper">
	{#await data.streamed}
		<SkeletonExercises />
	{:then result}
		<Exercises categories={result.categories} />
	{:catch error}
		<Error message={error.message} />
	{/await}
</div>

<style lang="scss">
	.wrapper {
		margin-top: $space-md + $space-sm;
	}
</style>
