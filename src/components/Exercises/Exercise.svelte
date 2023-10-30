<script lang="ts">
	import { dictionary } from "$src/lib/language/dictionary";
	import type { PageExercise, PageMandatoryExercise } from "$src/routes/exercises/types";
	import toast from "$src/lib/toast";
	import axios from "axios";
	import type { Exercise } from "$src/db/schema/exercise";
	import EditText from "$components/EditText.svelte";
	import { apiRoutes } from "$src/lib/paths";
	import WorkoutOverview from "./WorkoutOverview.svelte";

	export let exercise: PageExercise;
	// todo fix this picovina
	const fixedExercise: PageMandatoryExercise = exercise as unknown as PageMandatoryExercise;

	const areWorkouts = exercise.workoutHistory?.length && exercise.bestWorkout;

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
</script>

{#if !areWorkouts}
	<li class="exercise">
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
	</li>
{:else}
	<li>
		<WorkoutOverview exercise={fixedExercise}>
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
	</li>
{/if}

<style lang="scss">
	@import "./Exercises.scss";

	.exercise {
		display: flex;

		flex-direction: column;
		min-width: $min-exercise-width;
		height: 100%;

		color: var(--text-secondary);
	}

	.name {
		text-align: center;
		font-size: $text-tag;
		font-weight: 700;
	}

	.noWorkout {
		// todo nastylovat podle pak dat
		display: flex;

		height: 100%;
		min-height: $space-lg;
		margin-top: $space-sm;
		padding: $space-md;
		border-radius: $border-radius;

		flex-grow: 1;
		align-items: center;
		justify-content: center;

		color: #{$text-color-history};
		background-color: #{$background-color-history};

		font-weight: 700;
	}
</style>
