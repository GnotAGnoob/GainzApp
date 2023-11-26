<script lang="ts">
	import Scroller from "$src/components/Scroller/Scroller.svelte";
	import Button from "$components/Atoms/Button/Button.svelte";
	import { dictionary } from "$src/lib/language/dictionary";
	import Icon from "@iconify/svelte";
	import type { PagePlannedWorkout } from "$src/routes/workouts/types";
	import { plannedWorkouts as plannedWorkoutsStore } from "$src/lib/stores/plannedWorkouts";
	import EditablePlanWorkoutCard from "./WorkoutCard/EditablePlanWorkoutCard.svelte";
	import PlanWorkoutCard from "./WorkoutCard/PlanWorkoutCard.svelte";

	export let plannedWorkouts: PagePlannedWorkout[] = [];
	plannedWorkoutsStore.set(plannedWorkouts);

	let isAddNewWorkout = false;

	$: disableNewWorkoutTitle = isAddNewWorkout && dictionary.YOU_HAVE_HAVE_TO_COMPLETE_PLANNING_THE_WORKOUT;

	const onAddWorkout = () => {
		isAddNewWorkout = true;
	};

	const onCancel = () => {
		isAddNewWorkout = false;
	};

	const onConfirm = () => {
		isAddNewWorkout = false;
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
			{#each $plannedWorkoutsStore as workout, index (workout.id)}
				<EditablePlanWorkoutCard title={index + 1} {workout} />
			{:else}
				<!-- todo empty -->
			{/each}
			{#if isAddNewWorkout}
				<PlanWorkoutCard title={dictionary.CREATING_NEW_WORKOUT} {onCancel} {onConfirm} />
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
