<script lang="ts">
	import type { Category } from "$src/db/schema/category";
	import { dictionary } from "$src/lib/language/dictionary";
	import axios from "axios";
	import EditText from "../EditText.svelte";
	import Exercise from "./Exercise.svelte";
	import type { PageCategory } from "$src/routes/exercises/types";
	import toast from "$src/lib/toast";
	import { apiRoutes } from "$src/lib/paths";
	import { categories } from "$src/lib/stores/categories";

	export let category: PageCategory;

	let errorMessage: string | null = null;

	// editing name
	const onConfirm = async (newValue: string) => {
		if (newValue === "" || newValue === category.name) {
			return;
		}

		const oldValue = category.name;

		try {
			category.name = newValue;

			const { data } = await axios.patch<Category>(`${apiRoutes.category}${category.id}`, { name: newValue });

			category.name = data.name;
		} catch (error) {
			toast.error(dictionary.RENAMING_CATEGORY_FAILED);

			category.name = oldValue;

			if (axios.isAxiosError(error)) {
				errorMessage = error.response?.data;
				return;
			}

			// @ts-ignore
			errorMessage = error?.message || dictionary.UNKNOWN_ERROR;
		}
	};

	const onDelete = async () => {
		const oldCategories = [...$categories];

		try {
			$categories = $categories.filter((c) => c.id !== category.id);
			const { data } = await axios.delete<PageCategory[]>(`${apiRoutes.category}${category.id}`);
			$categories = data;
		} catch (error) {
			toast.error(dictionary.DELETING_CATEGORY_FAILED);

			$categories = oldCategories;

			if (axios.isAxiosError(error)) {
				errorMessage = error.response?.data;
				return;
			}

			// @ts-ignore
			errorMessage = error?.message || dictionary.UNKNOWN_ERROR;
		}
	};
</script>

<section class="wrapper">
	<div class="header">
		<EditText
			text={category.name}
			isAddButton
			isEditButton={!category.isGlobal}
			{onConfirm}
			onDelete={!category.isGlobal ? onDelete : undefined}
			deleteConfirmationText={category.exercises?.length
				? dictionary.ARE_YOU_SURE_YOU_WANT_TO_DETELE_CATEGORY
				: undefined}
			{errorMessage}
		>
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

	.wrapper {
		width: 100%;
	}

	.header {
		display: flex;

		justify-content: center;
	}

	.category {
		--max-columns: 1;
		display: grid;

		min-width: $space-xxxl;
		min-height: $space-xl + $space-sm;
		padding: $space-sm $space-sm;
		border-radius: $border-md;

		justify-content: center;
		gap: $space-sm;

		background-color: var(--accent-neutral-100);

		grid-template-columns: repeat(
			min(var(--max-columns), var(--columns)),
			minmax($space-xxl + $space-xl, $space-xxxl + $space-xxl)
		);

		@media (min-width: $bp-620) {
			--max-columns: 2;
		}

		@media (min-width: $bp-900) {
			--max-columns: 3;
		}

		@media (min-width: $bp-1200) {
			--max-columns: 4;
		}

		&Title {
			text-align: center;
		}

		&Inner {
			display: flex;

			margin-top: $space-sm;

			justify-content: center;
		}
	}

	.empty {
		font-weight: 700;
		color: var(--text-secondary);
		text-align: center;

		align-self: center;
	}
</style>
