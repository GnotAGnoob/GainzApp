<script lang="ts">
	import type { Category } from "$src/db/schema/category";
	import { dictionary } from "$src/lib/language/dictionary";
	import axios from "axios";
	import EditText from "../EditText.svelte";
	import Exercise from "./Exercise.svelte";
	import type { PageCategory } from "$src/routes/exercises/types";
	import toast from "$src/lib/toast";

	export let category: PageCategory;

	let errorMessage: string | null = null;

	const onConfirm = async (newValue: string) => {
		if (newValue === "" || newValue === category.name) {
			return;
		}

		const oldValue = category.name;

		try {
			category.name = newValue;

			await axios.patch<Category>(`/api/category/${category.id}`, { name: newValue });
		} catch (error) {
			toast.error(dictionary.RENAMING_CATEGORY_FAILED);

			category.name = oldValue;

			if (axios.isAxiosError(error)) {
				errorMessage = errorMessage = error.response?.data;
			}

			// @ts-ignore
			errorMessage = error?.message || dictionary.UNKNOWN_ERROR;
		}
	};
</script>

<section>
	<div class="header">
		<EditText text={category.name} isAddButton {onConfirm} {errorMessage}>
			<h3 class="categoryTitle">{category.name}</h3>
		</EditText>
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

<style lang="scss">
	@import "./Exercises.scss";

	.header {
		display: flex;

		justify-content: center;
	}

	.category {
		display: flex;

		min-width: $space-xxxl;
		min-height: $space-xl + $space-sm;
		padding: $space-sm $space-sm;
		border-radius: $border-md;

		flex-direction: column;
		justify-content: center;
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
			--columns: 3;
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
