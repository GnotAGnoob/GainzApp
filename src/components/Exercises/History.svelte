<script lang="ts">
	import { dateFormat } from "$src/lib/date";
	import DisplaySets from "./Sets/DisplaySets.svelte";
	import Scroller from "$components/Scroller/Scroller.svelte";
	import type { PageDisplaySupersetExercise } from "$src/routes/exercises/types";

	export let workouts: PageDisplaySupersetExercise[];
</script>

<div class="history">
	<Scroller type="neutral" sideFade="medium" isScrollReverse arrowsPosition="top" isSidePadding={false}>
		<ul class="workouts">
			{#each workouts as workout, index (workout.id)}
				<li class="workout">
					<date class="date">{dateFormat(new Date(workout.date))}</date>
					<DisplaySets type={index % 2 === 1 ? "neutral" : "neutral_2"} sets={workout.sets} />
				</li>
			{/each}
		</ul>
	</Scroller>
</div>

<style lang="scss">
	@import "./Exercises.scss";

	.history {
		background-color: #{$background-color-history};

		overflow-x: hidden;
	}

	.workout {
		--_text-color: #{$text-color-history};

		display: flex;

		padding: $space-sm $space-sm $space-sm;
		margin-bottom: calc(-1 * var(--scroller-padding));

		flex-direction: column;
		flex-grow: 1;
		gap: $space-sm;

		color: var(--_text-color);

		&:nth-child(2n + 1) {
			background-color: #{$background-color-history-2};
			--_text-color: #{$text-color-history-2};
		}

		&s {
			display: flex;
		}
	}
	.date {
		font-size: $text-title;
		font-weight: $text-title-weight;
	}

	.date {
		padding-inline: $space-xs;
		text-align: right;
	}
</style>
