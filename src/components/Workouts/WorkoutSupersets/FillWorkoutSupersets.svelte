<script lang="ts">
	import type { PageCreateWorkout } from "$src/routes/workouts/types";
	import axios from "axios";
	import WourkoutSupersetsTemplate from "./WorkoutSupersetsTemplate.svelte";
	import FillSuperset from "../Superset/FillSuperset.svelte";

	export let workout: PageCreateWorkout;
	const workoutCopy = structuredClone(workout);
	export let overrideOnCancel: (() => void) | undefined = undefined;

	let errorMessage: string | undefined = undefined;

	export const onCancel = () => {
		workout = structuredClone(workoutCopy);
	};

	const onConfirm = async () => {
		// const mappedWorkout
		try {
			const { data } = await axios.post<PageCreateWorkout>("/api/workouts", workout);
			console.log(workout);
			// todo: send workout to backend
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
		<FillSuperset bind:exercises={superset.supersetExercises} order={index + 1} />
	{/each}
</WourkoutSupersetsTemplate>
