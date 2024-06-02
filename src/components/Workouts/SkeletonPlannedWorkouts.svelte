<script lang="ts">
	import { dictionary } from "$src/lib/language/dictionary";
	import PlannedWorkoutsTemplate from "./PlannedWorkoutsTemplate.svelte";
	import SkeletonWorkouts from "./SkeletonWorkouts.svelte";
</script>

<PlannedWorkoutsTemplate disableNewWorkoutTitle={dictionary.WORKOUTS_LOADING}>
	<SkeletonWorkouts />
</PlannedWorkoutsTemplate>
