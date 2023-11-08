<script lang="ts">
	import type { PageCreateWorkout, PagePlannedWorkout } from "$src/routes/workouts/types";
	import axios from "axios";
	import { apiRoutes } from "$src/lib/paths";
	import WourkoutSupersetsTemplate from "./WorkoutSupersetsTemplate.svelte";
	import FillSuperset from "../Superset/FillSuperset.svelte";

	export let workout: PageCreateWorkout | PagePlannedWorkout;

	let errorMessage: string | undefined = undefined;

	const onCancel = () => {};

	const onConfirm = async () => {
		try {
		} catch (error) {
			if (axios.isAxiosError(error)) {
				errorMessage = `${error.response?.data}. idk which element/what happened. too lazy to detect errors`;
				return;
			}

			errorMessage = "super unknown error";
		}
	};
</script>

<WourkoutSupersetsTemplate bind:workout {onConfirm} {onCancel} {errorMessage}>
	{#each workout?.supersets || [] as superset, index}
		<!-- todo udelat CreateSuperset a superset template -->
		<FillSuperset bind:exercises={superset.supersetExercises} order={index + 1} />
	{/each}
</WourkoutSupersetsTemplate>
