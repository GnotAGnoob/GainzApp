<script lang="ts">
	import PlannedWorkoutsTemplate from "./PlannedWorkoutsTemplate.svelte";
	import Scroller from "$src/components/Scroller/Scroller.svelte";
	import { dictionary } from "$src/lib/language/dictionary";
	import type { PagePlannedWorkout } from "$src/routes/types";
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

<PlannedWorkoutsTemplate on:click={onAddWorkout} {disableNewWorkoutTitle}>
	{#if $plannedWorkoutsStore.length || isAddNewWorkout}
		<div class="scroller">
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
		</div>
	{:else}
		<div class="empty">
			<EmptyCard text={dictionary.YOU_HAVE_NOT_PLANNED_ANY_WORKOUTS} />
		</div>
	{/if}
</PlannedWorkoutsTemplate>

<style lang="scss">
	.scroller {
		@media (max-width: $bp-512) {
			margin-inline: calc(var(--site-padding) * -1);
		}
	}

	.empty {
		margin-top: $space-sm;
	}
</style>
