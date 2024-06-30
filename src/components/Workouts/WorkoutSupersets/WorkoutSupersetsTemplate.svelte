<script lang="ts">
	import Button from "$components/Atoms/Button/Button.svelte";
	import { MAX_SUPERSETS } from "$src/lib/constants";
	import { dictionary } from "$src/lib/language/dictionary";
	import Icon from "@iconify/svelte";
	import type { PageCreateSuperset, PageCreateWorkout } from "$src/routes/types";
	import ErrorText from "../../Atoms/ErrorText.svelte";
	import toast from "$src/lib/toast";

	const emptySuperset: PageCreateSuperset = { supersetExercises: [] };

	export let workout: PageCreateWorkout;
	export let onConfirm: () => void;
	export let onCancel: () => void;
	export let errorMessage: string | undefined = undefined;
	export let disableConfirmButtonText: string | undefined = undefined;
	export let isSameAllowed = true;
	export let isLoading = false;

	let scrollElement: HTMLElement | null = null;

	// might not be very performant
	const workoutCopy = structuredClone(workout);
	$: isWorkoutSame = !isSameAllowed && JSON.stringify(workoutCopy) === JSON.stringify(workout);

	$: areAllSupersetsFilled =
		!workout ||
		workout.supersets.every((superset) => {
			if (!superset.supersetExercises.length) return false;

			return superset.supersetExercises.every(
				(activity) => activity.exercise.category.name.length && activity.exercise.name.length,
			);
		});

	$: loadingText = isLoading && dictionary.WAITING_FOR_RESPONSE;
	$: disabledSupersetText =
		(workout && workout.supersets.length >= MAX_SUPERSETS && dictionary.YOU_CANNOT_CREATE_MORE_ITEMS) ||
		(!areAllSupersetsFilled && dictionary.YOU_HAVE_TO_FILL_ALL_FIELDS) ||
		loadingText;

	$: disableConfirmButton =
		(!workout?.supersets[0].supersetExercises.length && dictionary.YOU_HAVE_TO_ADD_ATLEAST_ONE_EXERCISE) ||
		(!areAllSupersetsFilled && dictionary.YOU_HAVE_TO_FILL_ALL_FIELDS) ||
		(isWorkoutSame && dictionary.YOU_HAVE_TO_MAKE_CHANGE) ||
		loadingText;

	const onAddSuperset = () => {
		if (isLoading) return;
		workout = { ...workout, supersets: [...(workout?.supersets || []), { ...emptySuperset }] };

		setTimeout(() => {
			scrollElement?.scrollTo({ top: scrollElement.scrollHeight, behavior: "smooth" });
		}, 0);
	};

	const handleConfirm = () => {
		if (isLoading) return;

		if (!areAllSupersetsFilled) {
			toast.error(dictionary.YOU_HAVE_TO_FILL_ALL_FIELDS);
			return;
		}

		onConfirm();
	};
</script>

<div class="supersets">
	<div class="content" bind:this={scrollElement}>
		<slot />
	</div>
	<div class="controls">
		{#if errorMessage}
			<ErrorText text={errorMessage} />
		{/if}
		<div class="button">
			<Button type="info" padding="md" on:click={onAddSuperset} disabledTitle={disabledSupersetText} isFullSize>
				<!-- Solar nema normalni plus... -->
				<Icon icon="iconoir:plus" />
				<span>{dictionary.ADD_NEW_SUPERSET}</span>
			</Button>
		</div>
		<div class="buttons">
			<Button type="negative" padding="md" on:click={onCancel} isFullSize disabledTitle={loadingText}>
				<span>{dictionary.CANCEL}</span>
			</Button>
			<Button
				type="positive"
				padding="md"
				on:click={handleConfirm}
				disabledTitle={disableConfirmButton || disableConfirmButtonText}
				isFullSize
				{isLoading}
			>
				<span>{dictionary.CONFIRM}</span>
			</Button>
		</div>
	</div>
	<div />
</div>

<style lang="scss">
	.supersets {
		display: flex;

		flex-direction: column;

		gap: $space-sm + $space-xs;

		height: 100%;
		min-height: 0;
	}

	.content {
		flex: 1;
		overflow-y: auto;
		overflow-x: hidden;
	}

	.controls {
		display: flex;
		flex-direction: column;
		gap: $space-sm;
	}

	.button {
		&s {
			display: flex;
			gap: $space-sm;
		}
	}
</style>
