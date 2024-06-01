<script>
	import PageTemplate from "./PageTemplate.svelte";
	import PlannedWorkouts from "$src/components/Workouts/PlannedWorkouts.svelte";
	import WorkoutHistory from "$src/components/Workouts/WorkoutHistory.svelte";
	// import { floatedCorner } from "$src/lib/stores/floatedCorner";
	import SkeletonWorkouts from "$src/components/Workouts/SkeletonWorkouts.svelte";
	import SkeletonPlannedWorkouts from "$src/components/Workouts/SkeletonPlannedWorkouts.svelte";
	import Error from "$src/components/Errors/Error.svelte";

	export let data;

	// $floatedCorner = [];
</script>

{#await data.streamed}
	<PageTemplate>
		<SkeletonPlannedWorkouts slot="planned" />
		<SkeletonWorkouts slot="history" />
	</PageTemplate>
{:then result}
	<PageTemplate>
		<PlannedWorkouts slot="planned" plannedWorkouts={result.plannedWorkouts} />
		<WorkoutHistory slot="history" workoutHistory={result.workoutHistory} />
	</PageTemplate>
{:catch error}
	<Error message={error.message} />
{/await}
