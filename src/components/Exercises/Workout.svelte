<script lang="ts">
	import { dateFormat } from "$src/lib/date";
	import type { StylesType } from "$src/lib/types";
	import type { PageWorkout } from "$src/routes/exercises/types";
	import Scroller from "$components/Scroller/Scroller.svelte";
	import DisplaySets from "./Sets/DisplaySets.svelte";

	export let workout: PageWorkout | undefined = undefined;
	export let title: string;
	export let type: StylesType = "info";
</script>

<div class="workout workout_{type}">
	<h5 class="title">
		<span>{title}</span>
		{#if workout}
			<date class="date">{dateFormat(workout.date)}</date>
		{/if}
	</h5>
	{#if workout}
		<Scroller {type} arrowsPosition="top">
			<DisplaySets {type} sets={workout.sets} />
		</Scroller>
	{/if}
</div>

<style lang="scss">
	@import "./Exercises.scss";

	.workout {
		--_background-color: #{$background-color-default};

		display: flex;

		padding-top: $space-xs;

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

		&_positive {
			--_background-color: #{$background-color-best};
		}

		&_neutral {
			--_background-color: #{$background-color-history};
		}
	}

	.title {
		display: flex;

		padding-inline: $space-sm;

		justify-content: space-between;

		font-weight: $text-title-weight;
		font-size: $text-title;
		text-transform: capitalize;
	}
</style>
