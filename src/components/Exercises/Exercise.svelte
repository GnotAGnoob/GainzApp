<script lang="ts">
	import { dictionary } from "$src/lib/language/dictionary";
	import { Collapse } from "@svelteuidev/core";
	import Workout from "./Workout.svelte";
	import History from "./History.svelte";
	import type { PageExercise } from "$src/routes/exercises/types";
	import { categories } from "$src/lib/stores/categories";
	import toast from "$src/lib/toast";
	import axios from "axios";
	import type { Exercise } from "$src/db/schema/exercise";
	import EditText from "$components/EditText.svelte";

	// TODO: vylepsit typ
	export let exercise: PageExercise;

	let open = false;
	const lastWorkout = exercise.workoutHistory?.[exercise.workoutHistory.length - 1];
	const bestWorkout = exercise.bestWorkout;
	const areWorkouts = lastWorkout && bestWorkout;

	let errorMessage: string | null = null;

	const onConfirm = async (newValue: string) => {
		if (newValue === "" || newValue === exercise.name) {
			return;
		}

		const oldValue = exercise.name;

		try {
			exercise.name = newValue;

			await axios.patch<Exercise & { categoryId: number }>(`/api/exercise/${exercise.id}`, {
				name: newValue,
			});
		} catch (error) {
			toast.error(dictionary.RENAMING_CATEGORY_FAILED);

			exercise.name = oldValue;

			if (axios.isAxiosError(error)) {
				errorMessage = errorMessage = error.response?.data;
			}

			// @ts-ignore
			errorMessage = error?.message || dictionary.UNKNOWN_ERROR;
		}
	};
</script>

{#if !areWorkouts}
	<li class="exercise">
		<EditText text={exercise.name} {onConfirm} {errorMessage} buttonType="noBackground_2" inputSize="sm">
			<h4 class="name">{exercise.name}</h4>
		</EditText>
		<h5 class="noWorkout">
			{dictionary.NO_WORKOUTS}
		</h5>
	</li>
{:else}
	<button class="button" on:click={() => (open = !open)}>
		<li class="exercise">
			<EditText text={exercise.name} {onConfirm} {errorMessage} buttonType="noBackground_2" inputSize="sm">
				<h4 class="name">{exercise.name}</h4>
			</EditText>
			<div class="workoutsWrapper" class:workoutsWrapper_open={open}>
				{#if lastWorkout.id === bestWorkout.id}
					<div>
						<Workout title={dictionary.BEST_AND_LAST} workout={bestWorkout} type="best" />
					</div>
				{:else}
					<div class="workouts">
						<Workout title={dictionary.BEST} workout={bestWorkout} type="best" />
						<Workout title={dictionary.LAST} workout={lastWorkout} />
					</div>
				{/if}
			</div>
			<Collapse {open} transitionDuration={255}>
				<History workouts={exercise.workoutHistory} />
			</Collapse>
		</li>
	</button>
{/if}

<style lang="scss">
	@import "./Exercises.scss";

	.button {
		overflow-x: hidden;
	}

	.exercise {
		display: flex;

		flex-direction: column;
		min-width: $space-xxl + $space-xl;
		height: 100%;

		color: var(--text-secondary);
	}

	.name {
		text-align: center;
		font-size: $text-tag;
		font-weight: 700;
	}

	.workouts {
		display: grid;

		grid-template-columns: 1fr 1fr;

		&Wrapper {
			position: relative;

			margin-top: $space-sm;

			z-index: 1;

			&::after {
				content: "";
				position: absolute;

				inset: 50% 0 0 0;

				background-color: #{$background-color-history};
				opacity: 0;

				transition: opacity 255ms ease-in-out;
				z-index: -1;
			}

			&_open::after {
				opacity: 1;
			}
		}
	}

	.noWorkout {
		// todo nastylovat podle pak dat
		display: flex;

		height: 100%;
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
