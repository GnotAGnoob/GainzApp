<script lang="ts">
	import type { load } from "$src/routes/+page.server";
	import { dictionary } from "$src/lib/language/dictionary";
	import { dateFormat } from "$src/lib/date";
	import Sets from "./Sets.svelte";
	import Scroller from "./Scroller.svelte";

	// TODO typ
	export let workouts: Awaited<ReturnType<typeof load>>["categories"][0]["exercises"][0]["history"];
</script>

<div class="history">
	<span class="title">{dictionary.HISTORY}</span>
	<Scroller type="history" sideFade="medium" isScrollReverse>
		<div class="workouts">
			{#each workouts as workout, index}
				<div class="workout">
					<date class="date">{dateFormat(workout.date)}</date>
					<Sets type={index % 2 === 0 ? "history" : "history2"} sets={workout.sets} />
				</div>
			{/each}
		</div>
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
		margin-bottom: -$scroller-padding;

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
