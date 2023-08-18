<script lang="ts">
	import { dateFormat } from "$src/lib/date";
	import type { load } from "$src/routes/+page.server";
	import Sets from "./Sets.svelte";

	export let workout: Awaited<ReturnType<typeof load>>["categories"][0]["exercises"][0]["history"][0];
	export let title: string;
	export let type: "default" | "best" = "default";
</script>

<div class="workout workout--{type}">
	<p class="title">
		<span>{title}</span>
		<date class="date">{dateFormat(workout.date)}</date>
	</p>
	<Sets sets={workout.sets} />
</div>

<style lang="scss">
	$_border: $border-md;

	.workout {
		--_border-color: var(--accent-neutral-300);
		--_background-color: var(--accent-neutral-200);
		--_button-background-hover: var(--accent-neutral-300);
		--_text-color: inherit;
		--_text-secondary-color: var(--text-secondary);

		--_item-side-padding: #{$space-sm};

		display: flex;

		padding-top: $space-xs;

		flex-direction: column;
		gap: $space-sm;

		font-weight: 700;
		color: var(--_text-color);

		background-color: var(--_background-color);

		overflow-x: hidden;

		&:first-child {
			border-top-left-radius: $_border;
			border-bottom-left-radius: $_border;
		}

		&:last-child {
			border-top-right-radius: $_border;
			border-bottom-right-radius: $_border;
		}

		&--best {
			--_border-color: var(--accent-positive-400);
			--_text-color: var(--accent-positive-800);
			--_button-background-hover: var(--accent-positive-300);
			--_background-color: var(--accent-positive-200);
			--_text-secondary-color: var(--accent-positive-700);
		}
	}

	.title {
		display: flex;

		padding-inline: $space-sm;

		justify-content: space-between;

		font-weight: 900;
		font-size: $text-tag;
		text-transform: capitalize;
	}
</style>
