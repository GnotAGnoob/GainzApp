<script lang="ts">
	import { dictionary } from "$src/lib/language/dictionary";
	import type { PageCategory } from "$src/routes/list/types";
	import Exercise from "./Exercise.svelte";
	import ExercisesAddButton from "./ExercisesAddButton.svelte";

	// TODO: vylepsit typ
	export let categories: PageCategory[];

	// todo: vylepsit prazdny kategorie (mozna pridat tlacitko pro pridani nove kategorie)
</script>

<div class="button">
	<ExercisesAddButton padding="md" paddingSide="xl" fontSize="md" type="info">
		<span class="buttonInner">{dictionary.ADD_NEW_CATEGORY}</span>
	</ExercisesAddButton>
</div>
<div class="categories">
	{#each categories as category (category.id)}
		<section>
			<div class="header">
				<h3 class="categoryTitle">{category.name}</h3>
				<ExercisesAddButton category={category.name} isPaddingSame />
			</div>
			<div class="categoryInner">
				<ul class="category" style={`--columns: ${category.exercises?.length || 1}`}>
					{#if category.exercises?.length}
						{#each category.exercises as exercise (exercise.name)}
							<Exercise {exercise} />
						{/each}
					{:else}
						<div class="empty">{dictionary.NO_EXERCISES_CREATED}</div>
					{/if}
				</ul>
			</div>
		</section>
	{/each}
</div>

<style lang="scss">
	.categories {
		display: flex;

		margin-top: $space-md + $space-sm;
		gap: $space-md;

		flex-direction: column;
		align-items: center;
	}

	.header {
		display: flex;

		gap: $space-sm;

		align-items: center;
		justify-content: center;
	}

	.button {
		display: flex;

		margin-top: $space-md;
		margin-inline: auto;

		justify-content: center;
	}

	.category {
		display: flex;

		min-width: $space-xxl + $space-xl;
		min-height: $space-xl;
		padding: $space-sm $space-sm;
		border-radius: $border-md;

		flex-direction: column;
		gap: $space-sm;

		background-color: var(--accent-neutral-100);

		&Title {
			text-align: center;
		}

		&Inner {
			display: flex;

			margin-top: $space-sm;

			justify-content: center;
		}

		@media (min-width: $bp-512) {
			--max-columns: 2;
			display: grid;
			align-items: flex-start;
			grid-template-columns: repeat(min(var(--max-columns), var(--columns)), 1fr);
		}

		@media (min-width: $bp-760) {
			--max-columns: 3;
		}

		@media (min-width: $bp-1096) {
			--max-columns: 4;
		}
	}

	.empty {
		font-weight: 700;
		color: var(--text-secondary);
		text-align: center;

		align-self: center;
	}
</style>
