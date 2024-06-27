<script lang="ts">
	import { dateFormat } from "$src/lib/date";
	import type { StylesType } from "$src/lib/types";
	import type { PageDisplaySupersetExercise } from "$src/routes/exercises/types";
	import Scroller from "$components/Scroller/Scroller.svelte";
	import DisplaySets from "./Sets/DisplaySets.svelte";

	export let workout: PageDisplaySupersetExercise | undefined = undefined;
	export let title: string;
	export let type: StylesType = "info";
	export let isBottomBorderless = false;
	export let onClick: (() => void) | undefined = undefined;
</script>

<div class="workout workout_{type}" class:workout_bottomBorderNone={isBottomBorderless}>
	<h5 class="title">
		<span>{title}</span>
		{#if workout}
			<date class="date">{dateFormat(new Date(workout.date))}</date>
		{/if}
	</h5>
	{#if workout}
		<div class="scroller">
			<Scroller {type} arrowsPosition="top" {onClick}>
				<DisplaySets {type} sets={workout.sets} />
			</Scroller>
		</div>
	{/if}
</div>

<style lang="scss">
	@import "./Exercises.scss";

	.workout {
		--_background-color: #{$background-color-default};
		--_color: #{$text-color-default};

		display: flex;

		padding-top: $space-xs;
		height: 100%;

		flex-direction: column;
		gap: $space-sm;

		font-weight: 700;

		background-color: var(--_background-color);

		overflow-x: hidden;

		&:first-child {
			border-top-left-radius: $border-radius;
			border-bottom-left-radius: $border-radius;
		}

		&:last-child {
			border-top-right-radius: $border-radius;
			border-bottom-right-radius: $border-radius;
		}

		&_bottomBorderNone {
			&#{&} {
				border-bottom-left-radius: unset;
				border-bottom-right-radius: unset;
			}
		}

		&_positive {
			--_background-color: #{$background-color-best};
			--_color: #{$text-color-best};
		}

		&_neutral {
			--_background-color: #{$background-color-history};
			--_color: var(--accent-positive-800);
		}
	}

	.title {
		display: flex;

		padding-inline: $space-sm;

		justify-content: space-between;

		font-weight: $text-title-weight;
		font-size: $text-title;
		text-transform: capitalize;
		color: var(--_color);
	}

	.scroller {
		display: flex;

		align-items: center;
		justify-content: center;
		flex: 1;

		z-index: 1;
	}
</style>
