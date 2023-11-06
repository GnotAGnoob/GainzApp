<script lang="ts">
	import { plannedWorkouts } from "$lib/stores/plannedWorkouts";
	import Button from "$components/Atoms/Button/Button.svelte";
	import { MAX_SUPERSETS } from "$src/lib/constants";
	import { dictionary } from "$src/lib/language/dictionary";
	import Icon from "@iconify/svelte";
	import EditableSuperset from "../EditableSuperset.svelte";
	import Superset from "../Superset.svelte";
	import type { PageCreateSuperset, PageCreateWorkout, PagePlannedWorkout } from "$src/routes/workouts/types";
	import axios from "axios";
	import ErrorText from "../../Atoms/ErrorText.svelte";
	import toast from "$src/lib/toast";
	import { apiRoutes } from "$src/lib/paths";

	const emptySuperset: PageCreateSuperset = { supersetExercises: [] };

	export let workout: PageCreateWorkout | PagePlannedWorkout = { supersets: [{ ...emptySuperset }] };
	export let mode: "edit" | "write" | "display" = "display";

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
		(!workout?.supersets[0].supersetExercises.length && dictionary.YOU_HAVE_TO_ADD_ATLEAST_ONE_EXERCISE) ||
		(!areAllSupersetsFilled && dictionary.YOU_HAVE_TO_FILL_ALL_FIELDS);

	const onAddSuperset = () => {
		workout = { supersets: [...(workout?.supersets || []), { ...emptySuperset }] };
	};

	const onCancel = () => {
		mode = "display";
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
			mode = "display";
		} catch (error) {
			if (axios.isAxiosError(error)) {
				errorMessage = `${error.response?.data}. idk which element/what happened. too lazy to detect errors`;
				return;
			}

			errorMessage = "super unknown error";
		}
	};
</script>

<div class="workout">
	<div class="supersets">
		{#if mode !== "display"}
			{#each workout?.supersets || [] as superset, index}
				<EditableSuperset bind:exercises={superset.supersetExercises} order={index + 1} />
				// todo misto editable superset asi pridat zapisovaci superset
			{/each}
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
			<div />
		{:else}
			{#each workout?.supersets || [] as superset, index}
				<Superset exercises={superset.supersetExercises} order={index + 1} />
			{/each}
		{/if}
	</div>
</div>

<style lang="scss">
	@import "./workouts.scss";

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
