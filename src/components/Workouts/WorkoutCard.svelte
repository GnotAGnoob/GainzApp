<script lang="ts">
	import EditButtons from "$components/EditButtons.svelte";
	import Superset from "./Superset.svelte";

	export let supersets: any[] = [];
	export let title: number | string;

	let isInEditMode: boolean;
</script>

<li class="wrapper">
	<h4 class="title">{title}</h4>
	<div class="workoutWrapper">
		<div class="edit">
			<EditButtons buttonType="noBackground_2" isAbsolute={false} padding="sm" isConfirmButton={false} />
		</div>
		<div class="workout">
			<!-- todo superset jen kdyt 2+ exercisu -->
			<div class="supersets">
				{#each supersets as superset, index}
					<Superset exercises={superset.exercises} order={index + 1} />
				{:else}
					<!-- todo better -->
					problem
				{/each}
			</div>
		</div>
	</div>
</li>

<style lang="scss">
	.wrapper {
		display: flex;

		min-width: $space-xxxl;
		width: max-content;
		max-width: $space-xxxl + $space-xxl;

		justify-content: center;
		flex-direction: column;

		gap: $space-xs;
	}

	.workout {
		&Wrapper {
			position: relative;

			padding: ($space-sm + $space-xs) ($space-md) ($space-md);

			border-radius: $border-md;
			background-color: var(--accent-neutral-100);
		}
	}

	.title {
		text-align: center;

		font-weight: 900;
		color: var(--text-secondary);
	}

	.category {
		font-weight: 700;
	}

	.edit {
		position: absolute;
		top: $space-sm;
		right: $space-xxs;
	}

	.exercise {
		display: flex;

		gap: $space-sm;
		font-size: $text;

		&s {
			display: flex;

			flex-direction: column;

			line-height: 1;
		}
	}

	.superset {
		display: flex;

		gap: $space-xxs;

		flex-direction: column;

		color: var(--accent-neutral-700);

		&s {
			display: flex;

			flex-direction: column;

			gap: $space-sm + $space-xs;
		}

		&Title {
			font-size: $text-tag;
			font-weight: 700;
			color: var(--text-secondary);
		}
	}
</style>
