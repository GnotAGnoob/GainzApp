<script lang="ts">
	import Scroller from "$src/components/Scroller/Scroller.svelte";
	import Button from "$components/Atoms/Button/Button.svelte";
	import WorkoutCard from "./WorkoutCard.svelte";
	import { dictionary } from "$src/lib/language/dictionary";
	import Icon from "@iconify/svelte";
	import type { PagePlannedWorkout } from "$src/routes/workouts/types";
	import { plannedWorkouts as plannedWorkoutsStore } from "$src/lib/stores/plannedWorkouts";

	export let plannedWorkouts: PagePlannedWorkout[] = [];
	plannedWorkoutsStore.set(plannedWorkouts);

	let isAddNewWorkout = false;

	$: disableNewWorkoutTitle = isAddNewWorkout && dictionary.YOU_HAVE_HAVE_TO_COMPLETE_PLANNING_THE_WORKOUT;

	const onAddWorkout = () => {
		isAddNewWorkout = true;
	};
</script>

<section class="wrapper">
	{#if $plannedWorkoutsStore.length || isAddNewWorkout}
		<Scroller
			wrapperTag="ol"
			sideFade="large"
			type="background"
			arrowsPosition="full"
			bottomPadding="medium"
			isScrollToEnd={isAddNewWorkout}
		>
			{#each $plannedWorkoutsStore as workout, index}
				<WorkoutCard title={index + 1} {workout} />
			{:else}
				<!-- empty list -->
			{/each}
			{#if isAddNewWorkout}
				<WorkoutCard title={dictionary.CREATING_NEW_WORKOUT} bind:isInEditMode={isAddNewWorkout} />
			{/if}
		</Scroller>
	{/if}
	<div class="button">
		<Button
			fontSize="md"
			type="info"
			paddingSide="xl"
			on:click={onAddWorkout}
			disabledTitle={disableNewWorkoutTitle}
		>
			<Icon icon="iconoir:plus" slot="leftIcon" />
			<span>{dictionary.PLAN_NEW_WORKOUTS}</span>
		</Button>
	</div>
</section>

<style lang="scss">
	.wrapper {
		display: flex;

		flex-direction: column;

		justify-content: center;

		gap: $space-md;
		margin-top: $space-md + $space-sm;
	}

	.button {
		margin-inline: auto;
	}
</style>
