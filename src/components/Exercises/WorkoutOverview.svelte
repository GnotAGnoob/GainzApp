<script lang="ts">
	import { dictionary } from "$src/lib/language/dictionary";
	import Workout from "./Workout.svelte";
	import History from "./History.svelte";
	import type { PageDisplaySupersetExercise } from "$src/routes/exercises/types";
	import Collapse from "$components/Atoms/Collapse.svelte";
	import Icon from "@iconify/svelte";

	export let bestWorkout: PageDisplaySupersetExercise;
	export let workoutHistory: PageDisplaySupersetExercise[];

	let isOpen = false;

	$: lastWorkout = workoutHistory[0];
	$: isEnoughHistory = workoutHistory.length > 1;

	const handleClick = () => {
		isOpen = !isOpen;
	};
</script>

<div class="exercise" class:isOpen>
	<Collapse isDisabled={!isEnoughHistory} isContentClickable bind:isOpen>
		<div class="title" slot="title">
			<slot />
			<div class="workoutsWrapper" class:workoutsWrapper_open={isOpen}>
				{#if lastWorkout.id === bestWorkout.id}
					<div>
						<Workout
							title={dictionary.BEST_AND_LAST}
							workout={bestWorkout}
							type="positive"
							isBottomBorderless={isEnoughHistory}
							onClick={handleClick}
						/>
					</div>
				{:else}
					<div class="workouts">
						<Workout
							title={dictionary.BEST}
							workout={bestWorkout}
							type="positive"
							isBottomBorderless
							onClick={handleClick}
						/>
						<Workout
							title={dictionary.LAST}
							workout={lastWorkout}
							isBottomBorderless={isEnoughHistory}
							onClick={handleClick}
						/>
					</div>
				{/if}
			</div>
		</div>

		<div class="content" slot="content">
			{#if isEnoughHistory}
				<History workouts={workoutHistory} />
			{/if}
		</div>
		<svelte:fragment slot="footer">
			{#if isEnoughHistory}
				<button class="historyButton" class:historyButton_open={isOpen} on:click={handleClick}>
					<div>{dictionary.HISTORY}</div>
					<div class="icon">
						<Icon icon="solar:alt-arrow-right-bold" />
					</div>
				</button>
			{/if}
		</svelte:fragment>
	</Collapse>
</div>

<style lang="scss">
	@import "./Exercises.scss";

	.title,
	.content {
		width: 100%;
	}

	.content {
		position: relative;

		z-index: 1;
	}

	.exercise {
		position: relative;

		min-width: $space-xxl + $space-xl;

		z-index: 1;
	}

	.workouts {
		display: grid;

		grid-template-columns: 1fr 1fr;
	}

	.historyButton {
		display: flex;
		position: relative;

		width: 100%;

		padding-block: $space-xs;
		border-bottom-left-radius: $border-radius;
		border-bottom-right-radius: $border-radius;

		justify-content: center;
		align-items: center;
		gap: $space-xxs;

		color: $text-color-history;
		font-weight: 700;
		font-size: $text-tag;
		background-color: $background-color-history;

		z-index: 1;

		&:hover {
			background-color: $background-color-history-2;
		}
	}

	.icon {
		font-size: $icon-md;

		transition: transform 0.15s ease-in-out;
		transform: translateY($space-px * 1);

		.historyButton_open & {
			transform: rotate(-90deg);
		}
	}
</style>
