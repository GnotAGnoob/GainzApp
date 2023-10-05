<script lang="ts">
	import { plannedWorkouts } from "$lib/stores/plannedWorkouts";
	import Button from "$components/Atoms/Button/Button.svelte";
	import EditButtons from "$components/EditButtons.svelte";
	import { MAX_SUPERSETS } from "$src/lib/constants";
	import { dictionary } from "$src/lib/language/dictionary";
	import Icon from "@iconify/svelte";
	import EditableSuperset from "./EditableSuperset.svelte";
	import Superset from "./Superset.svelte";
	import type { PageCreateSuperset, PageCreateWorkout, PagePlannedWorkout } from "$src/routes/workouts/types";
	import axios from "axios";
	import ErrorText from "../Atoms/ErrorText.svelte";
	import toast from "$src/lib/toast";
	import { apiRoutes } from "$src/lib/paths";

	const emptySuperset: PageCreateSuperset = { supersetExercises: [] };

	export let workout: PageCreateWorkout = { supersets: [{ ...emptySuperset }] };
	export let title: number | string;
	export let isInEditMode = !$$props.workout;

	let errorMessage: string | null = null;

	$: areAllSupersetsFilled =
		!workout ||
		workout.supersets.every((superset) => {
			if (!superset.supersetExercises.length) return false;

			return superset.supersetExercises.every(
				(activity) => activity.category.name.length && activity.exercise.name.length,
			);
		});
	$: disabledSupersetText =
		(workout && workout.supersets.length >= MAX_SUPERSETS && dictionary.YOU_CANNOT_CREATE_MORE_ITEMS) ||
		(!areAllSupersetsFilled && dictionary.YOU_HAVE_TO_FILL_ALL_FIELDS);

	$: disableConfirmButton =
		(!workout?.supersets[0].supersetExercises.length && dictionary.YOU_HAVE_TO_ADD_ATLEAST_ONE_EXRCISE) ||
		(!areAllSupersetsFilled && dictionary.YOU_HAVE_TO_FILL_ALL_FIELDS);

	const onAddSuperset = () => {
		workout = { supersets: [...(workout?.supersets || []), { ...emptySuperset }] };
	};

	const onCancel = () => {
		workout = Object.assign([], workout);
		isInEditMode = false;
	};

	const onConfirm = async () => {
		if (!areAllSupersetsFilled) {
			toast.error(dictionary.YOU_HAVE_TO_FILL_ALL_FIELDS);
		}

		try {
			const { data: newPlannedWorkout } = await toast.promise(
				axios.post<PagePlannedWorkout>(apiRoutes.workout, workout),
				{
					loading: `${dictionary.CREATING_WORKOUT}`,
					success: `${dictionary.WORKOUT_SUCCESSFULLY_CREATED}`,
					error: dictionary.CREATING_WORKOUT_FAILED,
				},
			);

			$plannedWorkouts = [...$plannedWorkouts, newPlannedWorkout];
			isInEditMode = false;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				errorMessage = `${error.response?.data}. idk which element/what happened. too lazy to detect errors`;
				return;
			}

			errorMessage = "super unknown error";
		}
	};

	const onDelete = () => {
		isInEditMode = false;
	};

	// todo scroll and max height, maybe fixed height
</script>

<li class="wrapper">
	<h4 class="title">{title}</h4>
	<div class="workoutWrapper">
		<div class="edit">
			<EditButtons
				buttonType="noBackground_2"
				isAbsolute={false}
				buttonPadding="sm"
				isConfirmButton={false}
				{onCancel}
				{onDelete}
				deleteTitle={dictionary.DELETE_WORKOUT}
				bind:isInEditMode
			/>
		</div>
		<div class="workout">
			<!-- todo superset jen kdyt 2+ exercisu -->
			<div class="supersets">
				{#if isInEditMode}
					{#each workout?.supersets || [] as superset, index}
						<EditableSuperset bind:exercises={superset.supersetExercises} order={index + 1} />
					{/each}
				{:else}
					{#each workout?.supersets || [] as superset, index}
						<Superset exercises={superset.supersetExercises} order={index + 1} />
					{/each}
				{/if}

				{#if isInEditMode}
					{#if errorMessage}
						<ErrorText text={errorMessage} />
					{/if}
					<div class="button">
						<Button
							type="info"
							padding="md"
							on:click={onAddSuperset}
							disabledTitle={disabledSupersetText}
							isFullSize
						>
							<!-- Solar nema normalni plus... -->
							<Icon icon="iconoir:plus" />
							<span>{dictionary.ADD_NEW_SUPERSET}</span>
						</Button>
					</div>
					<div class="buttons">
						<Button type="negative" padding="md" on:click={onCancel} isFullSize>
							<span>{dictionary.CANCEL}</span>
						</Button>
						<Button
							type="positive"
							padding="md"
							on:click={onConfirm}
							disabledTitle={disableConfirmButton}
							isFullSize
						>
							<span>{dictionary.CONFIRM}</span>
						</Button>
					</div>
				{/if}
			</div>
		</div>
	</div>
</li>

<style lang="scss">
	@import "./workouts.scss";

	.wrapper {
		display: flex;

		width: $space-xxxl;
		height: 100%;

		justify-content: center;
		flex-direction: column;

		gap: $space-xs;

		@media (min-width: $bp-396) {
			width: $space-xxxl + $space-xl;
		}

		@media (min-width: $bp-760) {
			width: $space-xxxl + $space-xxl;
		}
	}

	.workout {
		padding: ($space-md) $card-side-padding ($space-md + $space-sm);

		min-height: $space-xxl;
		max-height: $space-xxxl;
		overflow-y: auto;
		overflow-x: hidden;

		&Wrapper {
			position: relative;

			flex-grow: 1;

			border-radius: $border-md;
			background-color: var(--accent-neutral-100);
		}
	}

	.title {
		text-align: center;

		font-weight: 900;
		color: var(--text-secondary);
	}

	.edit {
		position: absolute;
		top: $space-xs;
		right: -$space-xs;
	}

	.supersets {
		display: flex;

		flex-direction: column;

		gap: $space-sm + $space-xs;
	}

	.button {
		&s {
			display: flex;
			gap: $space-sm;
		}
	}
</style>
