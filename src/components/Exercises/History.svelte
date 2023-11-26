<script lang="ts">
	import { dictionary } from "$src/lib/language/dictionary";
	import { dateFormat } from "$src/lib/date";
	import DisplaySets from "./Sets/DisplaySets.svelte";
	import Scroller from "$components/Scroller/Scroller.svelte";
	import type { PageWorkout } from "$src/routes/exercises/types";

	export let workouts: PageWorkout[];
</script>

<div class="history">
	<span class="title">{dictionary.HISTORY}</span>
	<Scroller type="neutral" sideFade="medium" isScrollReverse arrowsPosition="top">
		<ul class="workouts">
			{#each workouts as workout, index (workout.id)}
				<li class="workout">
					<date class="date">{dateFormat(workout.date)}</date>
					<DisplaySets type={index % 2 === 0 ? "neutral" : "neutral_2"} sets={workout.sets} />
				</li>
			{/each}
		</ul>
	</Scroller>
</div>

<style lang="scss">
	@import "./Exercises.scss";

	.history {
		background-color: #{$background-color-history};

		border-bottom-left-radius: $border-radius;
		border-bottom-right-radius: $border-radius;

		overflow-x: hidden;
	}

	.workout {
		--_text-color: #{$text-color-history};

		display: flex;

		padding: $space-xs $space-sm $space-sm;
		margin-bottom: calc(-1 * var(--scroller-padding));

		flex-direction: column;
		flex-grow: 1;
		gap: $space-sm;

		color: var(--_text-color);

		&:not(:first-child) {
			border-top-left-radius: $border-sm;
		}

		&:not(:last-child) {
			border-top-right-radius: $border-sm;
		}

		&:nth-child(2n) {
			background-color: #{$background-color-history-2};
			--_text-color: #{$text-color-history-2};
		}

		&s {
			display: flex;

			margin-top: $space-xs;
		}
	}

	.title,
	.date {
		font-size: $text-title;
		font-weight: $text-title-weight;
	}

	.date {
		padding-inline: $space-xs;
		text-align: right;
	}
</style>
