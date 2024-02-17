<script lang="ts">
	import Scroller from "$src/components/Scroller/Scroller.svelte";
	import Button from "$components/Atoms/Button/Button.svelte";
	import { dictionary } from "$src/lib/language/dictionary";
	import type { PagePlannedWorkout } from "$src/routes/types";
	import Icon from "@iconify/svelte";
	import { plannedWorkouts as plannedWorkoutsStore } from "$src/lib/stores/plannedWorkouts";
	import EditablePlanWorkoutCard from "./WorkoutCard/EditablePlanWorkoutCard.svelte";
	import PlanWorkoutCard from "./WorkoutCard/PlanWorkoutCard.svelte";
	import EmptyCard from "../Atoms/EmptyCard.svelte";

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
				<EditablePlanWorkoutCard title={index + 1} bind:workout />
			{/each}
			{#if isAddNewWorkout}
				<PlanWorkoutCard title={dictionary.CREATING_NEW_WORKOUT} {onCancel} {onConfirm} />
			{/if}
		</Scroller>
	{:else}
		<EmptyCard text={dictionary.YOU_HAVE_NOT_PLANNED_ANY_WORKOUTS} />
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
	}

	.button {
		margin-inline: auto;
	}
</style>
