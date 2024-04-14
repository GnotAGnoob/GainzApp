<script lang="ts">
	import type { Category } from "$src/db/schema/category";
	import { dictionary } from "$src/lib/language/dictionary";
	import axios from "axios";
	import EditText from "../EditText.svelte";
	import Exercise from "./Exercise.svelte";
	import type { PageExercise, PageCategory } from "$src/routes/exercises/types";
	import toast from "$src/lib/toast";
	import { apiRoutes } from "$src/lib/paths";
	import { categories } from "$src/lib/stores/categories";
	import ExerciseForm from "./ExerciseForm.svelte";
	import SelectDropdown from "$components/Atoms/Dropdown/SelectDropdown.svelte";
	import type Modal from "$components/Modals/Modal.svelte";
	import { setContext } from "svelte";
	import { writable } from "svelte/store";
	import EllipsisTooltip from "../Atoms/Tooltip/EllipsisTooltip.svelte";

	export let category: PageCategory;

	let errorMessage: string | null = null;
	let isModalOpen = false;

	type Filter = (typeof dictionary)[keyof Pick<
		typeof dictionary,
		"HIDE_EMPTY" | "HIDE_GLOBAL" | "HIDE_USER_DEFINED"
	>];

	let selectedFilters: Filter[] = [dictionary.HIDE_EMPTY];
	const filterOptions: Filter[] = [dictionary.HIDE_EMPTY, dictionary.HIDE_GLOBAL, dictionary.HIDE_USER_DEFINED];

	const exercises = writable<PageExercise[] | undefined>();
	$: exercises.set(category.exercises);

	let filteredExercises = $exercises;

	$: {
		if (!selectedFilters.length) {
			filteredExercises = $exercises;
		}

		filteredExercises = $exercises?.filter((exercise) => {
			// the conditions test if it is false
			if (selectedFilters.includes(dictionary.HIDE_EMPTY) && !exercise.workoutHistory) {
				return false;
			}

			if (selectedFilters.includes(dictionary.HIDE_GLOBAL) && exercise.isGlobal) {
				return false;
			}

			if (selectedFilters.includes(dictionary.HIDE_USER_DEFINED) && !exercise.isGlobal) {
				return false;
			}

			return true;
		});
	}

	setContext("exercises", exercises);

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

	const onAdd = () => {
		isModalOpen = true;
	};
</script>

<section class="wrapper">
	<div class="header">
		<EditText
			text={category.name}
			{onAdd}
			isEditButton={!category.isGlobal}
			{onConfirm}
			onDelete={!category.isGlobal ? onDelete : undefined}
			deleteConfirmationText={$exercises?.length
				? dictionary.ARE_YOU_SURE_YOU_WANT_TO_DETELE_CATEGORY
				: undefined}
			{errorMessage}
		>
			<h3 class="categoryTitle"><EllipsisTooltip text={category.name} /></h3>
		</EditText>
		<ExerciseForm category={category.name} bind:isOpen={isModalOpen} />
		<div class="filter">
			<SelectDropdown options={filterOptions} bind:selected={selectedFilters} />
		</div>
	</div>
	<div class="categoryInner">
		<ul class="category" style={`--columns: ${filteredExercises?.length || 1}`}>
			{#if filteredExercises?.length}
				{#each filteredExercises as exercise (exercise.id)}
					<Exercise {exercise} />
				{/each}
			{:else}
				<div class="empty">
					{$exercises?.length
						? dictionary.NO_EXERCISES_MATCH_THE_SELECTED_FILTERS
						: dictionary.NO_EXERCISES_CREATED}
				</div>
			{/if}
		</ul>
	</div>
</section>

<style lang="scss">
	@import "./Exercises.scss";

	.header {
		display: flex;
		position: relative;

		justify-content: center;
	}

	.filter {
		position: absolute;

		right: 0;
		top: 50%;
		transform: translateY(-50%);
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
		row-gap: $space-md;

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
			// todo make better when new edit buttons are done
			max-width: $space-xxl + $space-lg;
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
