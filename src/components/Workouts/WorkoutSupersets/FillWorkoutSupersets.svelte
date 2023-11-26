<script lang="ts">
	import type { PageFillWorkout } from "$src/routes/workouts/types";
	import axios from "axios";
	import WourkoutSupersetsTemplate from "./WorkoutSupersetsTemplate.svelte";
	import FillSuperset from "../Superset/FillSuperset.svelte";
	import { apiRoutes } from "$src/lib/paths";

	export let workout: PageFillWorkout;
	const workoutCopy = structuredClone(workout);
	export let overrideOnCancel: (() => void) | undefined = undefined;

	let errorMessage: string | undefined = undefined;
	// todo disable confirm button

	export const onCancel = () => {
		workout = structuredClone(workoutCopy);
	};

	const onConfirm = async () => {
		try {
			const { data } = await axios.put<PageFillWorkout>(apiRoutes.completeWorkout + workout.id, workout);
			console.log(workout);
			// todo: set data to store
		} catch (error) {
			if (axios.isAxiosError(error)) {
				errorMessage = `${error.response?.data}. idk which element/what happened. too lazy to detect errors`;
				return;
			}

			errorMessage = "super unknown error";
		}
	};
</script>

<WourkoutSupersetsTemplate bind:workout {onConfirm} onCancel={overrideOnCancel || onCancel} {errorMessage}>
	{#each workout?.supersets || [] as superset, index}
		<FillSuperset bind:supersetExercises={superset.supersetExercises} order={index + 1} />
	{/each}
</WourkoutSupersetsTemplate>
