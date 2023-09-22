<script lang="ts">
	import Scroller from "$src/components/Scroller/Scroller.svelte";
	import Button from "$components/Atoms/Button/Button.svelte";
	import { dictionary } from "$lib/language/dictionary";
	import WorkoutCard from "./WorkoutCard.svelte";

	const preparedWorkouts: any[] = [];

	const test = [
		{
			exercises: [
				{
					category: "biceps",
					name: "skull crusher",
				},
				{
					category: "lats",
					name: "row",
				},
				{
					category: "triceps",
					name: "pulldown",
				},
			],
		},
		{
			exercises: [
				{
					category: "biceps",
					name: "skull crusher",
				},
				{
					category: "lats",
					name: "row",
				},
				{
					category: "triceps",
					name: "pulldown",
				},
			],
		},
		{
			exercises: [
				{
					category: "biceps",
					name: "skull crusher",
				},
				{
					category: "lats",
					name: "row",
				},
				{
					category: "triceps",
					name: "pulldown",
				},
			],
		},
		{
			exercises: [
				{
					category: "biceps",
					name: "skull crusher",
				},
			],
		},
	];
</script>

<section class="wrapper">
	<!-- <div class="button">
		<Button fontSize="sm">
			<Icon icon="iconoir:plus" slot="leftIcon" />
			<span>{dictionary.PLAN_NEW_WORKOUTS}</span>
		</Button>
	</div> -->
	<Scroller wrapperTag="ol" sideFade="large" type="background" arrowsPosition="full">
		<!-- {#each preparedWorkouts as workout, index} -->
		<WorkoutCard index={1} supersets={test} />
		<WorkoutCard index={1} supersets={test} />
		<WorkoutCard index={1} supersets={test} />
		<WorkoutCard index={1} supersets={test} />
		<WorkoutCard index={1} supersets={test} />
		<!-- {/each} -->
	</Scroller>
	<div class="button">
		<Button type="neutral">start workout</Button>
	</div>
</section>

<style lang="scss">
	.wrapper {
		display: flex;

		flex-direction: column;

		justify-content: center;

		gap: $space-md;
	}

	.button {
		margin-inline: auto;
	}
</style>
