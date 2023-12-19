<script lang="ts">
	import { dictionary } from "$src/lib/language/dictionary";
	import type { PageExercise } from "$src/routes/exercises/types";
	import toast from "$src/lib/toast";
	import axios from "axios";
	import type { Exercise } from "$src/db/schema/exercise";
	import EditText from "$components/EditText.svelte";
	import { apiRoutes } from "$src/lib/paths";
	import WorkoutOverview from "./WorkoutOverview.svelte";

	export let exercise: PageExercise;

	let errorMessage: string | null = null;

	const onConfirm = async (newValue: string) => {
		if (newValue === "" || newValue === exercise.name) {
			return;
		}

		const oldValue = exercise.name;

		try {
			exercise.name = newValue;

			await axios.patch<Exercise & { categoryId: number }>(`${apiRoutes.exercise}${exercise.id}`, {
				name: newValue,
			});
		} catch (error) {
			toast.error(dictionary.RENAMING_CATEGORY_FAILED);

			exercise.name = oldValue;

			if (axios.isAxiosError(error)) {
				errorMessage = error.response?.data;
				return;
			}

			// @ts-ignore
			errorMessage = error?.message || dictionary.UNKNOWN_ERROR;
		}
	};

	console.log(exercise);
</script>

{#if !(exercise.workoutHistory?.length && exercise.bestWorkout)}
	<div class="exercise">
		<EditText
			text={exercise.name}
			{onConfirm}
			isEditButton={!exercise.isGlobal}
			{errorMessage}
			buttonType="noBackground_2"
			inputSize="sm"
		>
			<h4 class="name">{exercise.name}</h4>
		</EditText>
		<h5 class="noWorkout">
			{dictionary.NO_WORKOUTS}
		</h5>
	</div>
{:else}
	<WorkoutOverview workoutHistory={exercise.workoutHistory} bestWorkout={exercise.bestWorkout}>
		<EditText
			text={exercise.name}
			{onConfirm}
			isEditButton={!exercise.isGlobal}
			{errorMessage}
			buttonType="noBackground_2"
			inputSize="sm"
		>
			<h4 class="name">{exercise.name}</h4>
		</EditText>
	</WorkoutOverview>
{/if}

<style lang="scss">
	@import "./Exercises.scss";

	.exercise {
		display: flex;

		flex-direction: column;
		height: 100%;

		color: var(--text-secondary);
	}

	.name {
		text-align: center;
		font-size: $text-tag;
		font-weight: 700;
		color: var(--text-secondary);
	}

	.noWorkout {
		display: flex;

		height: 100%;
		min-height: $space-lg;
		margin-top: $space-sm;
		padding: ($space-md + $space-xs) $space-md;
		border-radius: $border-radius;

		flex-grow: 1;
		align-items: center;
		justify-content: center;

		color: #{$text-color-history};
		background-color: #{$background-color-history};

		font-weight: 700;
	}
</style>
