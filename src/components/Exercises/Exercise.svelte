<script lang="ts">
	import { dictionary } from "$src/lib/language/dictionary";
	import type { PageExercise } from "$src/routes/exercises/types";
	import toast from "$src/lib/toast";
	import axios from "axios";
	import type { Exercise } from "$src/db/schema/exercise";
	import EditText from "$components/EditText.svelte";
	import { apiRoutes } from "$src/lib/paths";
	import WorkoutOverview from "./WorkoutOverview.svelte";
	import { getContext } from "svelte";
	import type { Writable } from "svelte/store";
	import EllipsisTooltip from "../Atoms/Tooltip/EllipsisTooltip.svelte";

	export let exercise: PageExercise;

	let errorMessage: string | null = null;
	const deleteText = dictionary.ARE_YOU_SURE_YOU_WANT_TO_DETELE_EXERCISE || undefined;

	const exercises = getContext<Writable<PageExercise[] | undefined>>("exercises");

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

	const onDelete = async () => {
		if (!$exercises) {
			return;
		}

		const oldExercises = [...$exercises];
		try {
			$exercises = $exercises.filter((e) => e.id !== exercise.id);
			const { data } = await axios.delete<PageExercise[]>(`${apiRoutes.exercise}${exercise.id}`);
			$exercises = data;
		} catch (error) {
			toast.error(dictionary.DELETING_EXERCISE_FAILED);
			$exercises = oldExercises;
			if (axios.isAxiosError(error)) {
				errorMessage = error.response?.data;
				return;
			}
			// @ts-ignore
			errorMessage = error?.message || dictionary.UNKNOWN_ERROR;
		}
	};
</script>

{#if !(exercise.workoutHistory?.length && exercise.bestWorkout)}
	<div class="exercise">
		<div class="title">
			<EditText
				text={exercise.name}
				{onConfirm}
				isEditButton={!exercise.isGlobal}
				onDelete={!exercise.isGlobal ? onDelete : undefined}
				{errorMessage}
				buttonType="noBackground_2"
				inputSize="sm"
			>
				<h4 class="name"><EllipsisTooltip text={exercise.name} /></h4>
			</EditText>
		</div>
		<h5 class="noWorkout">
			{dictionary.NO_WORKOUTS}
		</h5>
	</div>
{:else}
	<WorkoutOverview workoutHistory={exercise.workoutHistory} bestWorkout={exercise.bestWorkout}>
		<div class="title">
			<EditText
				text={exercise.name}
				{onConfirm}
				isEditButton={!exercise.isGlobal}
				onDelete={!exercise.isGlobal ? onDelete : undefined}
				deleteConfirmationText={deleteText}
				{errorMessage}
				buttonType="noBackground_2"
				inputSize="sm"
			>
				<h4 class="name"><EllipsisTooltip text={exercise.name} /></h4>
			</EditText>
		</div>
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

	.title {
		margin-bottom: $space-xs;
	}

	.name {
		max-width: $space-xxl + $space-xl + $space-lg;

		text-align: center;
		font-size: $text-tag;
		font-weight: 700;
		line-height: 1;
		color: var(--text-secondary);
	}

	.noWorkout {
		display: flex;

		height: 100%;
		min-height: $space-lg;
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
