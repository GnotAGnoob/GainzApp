<script lang="ts">
	import { dateFormat } from "$src/lib/date";
	import type { load } from "$src/routes/+page.server";
	import { onMount } from "svelte";

	export let workout: Awaited<ReturnType<typeof load>>["categories"][0]["exercises"][0]["history"][0];
	export let title: string;
	export let type: "default" | "best" = "default";

	let scrollElement: HTMLDivElement;
	let isOverflowing = false;

	onMount(() => {
		isOverflowing = scrollElement.scrollWidth > scrollElement.clientWidth;
		console.log(isOverflowing, scrollElement);
	});
</script>

<div class="workout workout--{type}">
	<p class="title">
		<span>{title}</span>
		<date class="date">{dateFormat(workout.date)}</date>
	</p>
	<div class="setsWrapper" bind:this={scrollElement}>
		<ul class="sets">
			{#each workout.sets as bestWorkout, index}
				<li class="set">
					<div class="setNumberWrapper">
						<div class="setNumber">{index + 1}</div>
					</div>
					<div class="setInner">
						<div class="setBorderWrapper">
							<span class="weight">{bestWorkout.weight}kg</span>
							<span class="reps">
								<span class="times">x</span>
								<span>{bestWorkout.reps}</span>
							</span>
						</div>
					</div>
				</li>
			{/each}
			{#each workout.sets as bestWorkout, index}
				{#if index < Math.random() * 3}
					<li class="set">
						<div class="setNumberWrapper">
							<div class="setNumber">{index + 4}</div>
						</div>
						<div class="setInner">
							<div class="setBorderWrapper">
								<span class="weight">{bestWorkout.weight}kg</span>
								<span class="reps">
									<span class="times">x</span>
									<span>{bestWorkout.reps}</span>
								</span>
							</div>
						</div>
					</li>
				{/if}
			{/each}
		</ul>
	</div>
</div>

<style lang="scss">
	$_border: $border-md;

	.workout {
		--_border-color: var(--accent-neutral-300);
		--_background-color: var(--accent-neutral-200);
		--_text-color: inherit;
		--_text-secondary-color: var(--text-secondary);

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

	.set {
		--_item-side-padding: #{$space-sm};

		display: flex;

		flex-direction: column;
		align-items: flex-end;

		&Inner {
			display: flex;

			align-items: center;

			.set:not(:first-child) &::before {
				content: "";
				display: block;
				width: $space-px;
				height: 50%;
				background-color: var(--_border-color);
			}
		}

		&BorderWrapper {
			margin-inline: var(--_item-side-padding);
			line-height: 1;
		}

		&s {
			display: grid;

			width: max-content;
			margin: auto;

			grid-auto-columns: 1fr;
			grid-auto-flow: column;

			&Wrapper {
				width: 100%;

				padding-bottom: $space-sm;
				overflow-x: scroll;
			}
		}

		&Number {
			width: 100%;
			padding-bottom: $space-xxs;
			border-bottom: $space-px solid var(--_border-color);

			font-size: $text-smallest;
			font-weight: 900;

			&Wrapper {
				width: 100%;
				padding-inline: var(--_item-side-padding);

				text-align: center;
			}
		}
	}

	.weight {
		color: var(--_text-secondary-color);
		font-size: $text-tag;
		font-weight: 500;
	}

	.times {
		color: var(--_text-secondary-color);
		font-size: $text-tag;
		font-weight: 300;
	}

	.reps {
		display: flex;

		margin-top: $space-xxs;

		gap: $space-xs;
		align-items: baseline;
		justify-content: space-between;
	}
</style>
