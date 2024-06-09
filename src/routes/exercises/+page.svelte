<script lang="ts">
	import SkeletonExercises from "./../../components/Exercises/SkeletonExercises.svelte";
	import { floatedCorner } from "$src/lib/stores/floatedCorner";
	import Exercises from "$src/components/Exercises/Exercises.svelte";
	import ErrorPage from "$src/components/Errors/ErrorPage.svelte";

	export let data;

	$floatedCorner = ["addExercise"];
</script>

{#await data.streamed}
	<div class="wrapper">
		<SkeletonExercises />
	</div>
{:then result}
	<div class="wrapper">
		<Exercises categories={result.categories} units={result.units} />
	</div>
{:catch error}
	<ErrorPage message={error.message} />
{/await}

<style lang="scss">
	.wrapper {
		margin-top: $space-md + $space-sm;
	}
</style>
