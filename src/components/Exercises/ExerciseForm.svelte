<script lang="ts">
	import { dictionary } from "$src/lib/language/dictionary";
	import Icon from "@iconify/svelte";
	import Button from "../Atoms/Button/Button.svelte";
	import axios from "axios";
	import toast from "$src/lib/toast";
	import { categories } from "$src/lib/stores/categories";
	import type { Category } from "$src/db/schema/category";
	import type { PageCategory } from "$src/routes/exercises/types";
	import { apiRoutes } from "$src/lib/paths";
	import Modal from "$src/components/Modals/Modal.svelte";
	import ExerciseFormRow from "./ExerciseFormRow.svelte";
	import type { Unit } from "$src/db/schema/unit";
	import type { SelectType } from "../Atoms/Selects/types";
	import { units } from "$src/lib/stores/units";

	const MAX_EXERCISES = 10;

	export let category = "";
	export let isOpen: boolean;

	const emptyExercise = {
		categoryId: -1,
		category: category,
		name: "",
		unit: $units[0]?.name || "",
		errorMessage: "",
	};

	let isLoading = false;
	let exercises = [{ ...emptyExercise }];
	$: areExercisesFilled = exercises.every(
		(exercise) => exercise.category.length && exercise.name.length && exercise.unit.length,
	);

	$: categoryNames = $categories.map((category) => category.name);
	$: formCategories = new Set(exercises.map((exercise) => exercise.category));
	$: dropdownCategories = Array.from(new Set([...categoryNames, ...formCategories]));

	$: {
		if (!isOpen) {
			exercises = [{ ...emptyExercise }];
		}
	}

	const onSelectUnit = (inputsIndex: number, unit: SelectType<Unit>) => {
		if (Array.isArray(unit) || !unit) return;

		exercises[inputsIndex].unit = unit.value.name;
	};

	const onSelectCategory = (inputsIndex: number) => {
		exercises[inputsIndex].errorMessage = "";
	};

	const onAddExercise = () => {
		if (exercises.length < MAX_EXERCISES) {
			const unit = exercises.length ? exercises[exercises.length - 1].unit : "";
			const category = exercises.length ? exercises[exercises.length - 1].category : "";
			exercises = [...exercises, { ...emptyExercise, category, unit }];
		}
	};

	const onRemoveExercise = (index: number) => {
		if (exercises.length > 1) {
			exercises = exercises.filter((_, i) => i !== index);
		}
	};

	const onSubmit = async () => {
		isLoading = true;

		try {
			exercises = exercises.map((exercise) => ({ ...exercise, errorMessage: "" }));
			const { data: newCategories } = await toast.promise(
				axios.post<PageCategory[]>(apiRoutes.exercises, exercises),
				{
					loading: `${dictionary.CREATING} ${dictionary.EXERCISES}`,
					success: `${dictionary.EXERCISES} ${dictionary.SUCCESSFULLY_CREATED}`,
					error: dictionary.CREATING_EXERCISES_FAILED,
				},
			);

			$categories = newCategories;
			isOpen = false;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				exercises[
					exercises.length - 1
				].errorMessage = `${error.response?.data}. idk which element/what happened. too lazy to detect errors`;
			}
		}

		isLoading = false;
	};

	const onCreateNewCategory = (value: string, index: number) => {
		return new Promise<void>((resolve, reject) => {
			const fetchData = async () => {
				try {
					exercises[index].errorMessage = "";

					const response = await toast.promise(axios.post<Category>(apiRoutes.category, value), {
						loading: `${dictionary.CREATING} ${dictionary.CATEGORY}`,
						success: `${dictionary.CATEGORY} '${value}' ${dictionary.SUCCESSFULLY_CREATED}`,
						error: dictionary.CREATING_CATEGORY_FAILED,
					});

					$categories = [...$categories, response.data];
					resolve();
				} catch (error) {
					if (axios.isAxiosError(error)) {
						exercises[index].errorMessage = `Category: ${error.response?.data}`;
					}
					reject(error);
				}
			};

			fetchData();
		});
	};

	$: disabledAddExerciseTitle = exercises.length === MAX_EXERCISES ? dictionary.REACHED_MAX_EXERCISES : undefined;
	$: disabledRemoveExerciseTitle = exercises.length === 1 ? dictionary.CANNOT_DELETE_LAST_EXERCISE : undefined;
</script>

<Modal bind:isOpen size="lg">
	<form class="form">
		<h2 class="title">{dictionary.ADD_NEW_EXERCISES}</h2>
		{#each exercises as exercise, index}
			<ExerciseFormRow
				bind:exercise
				categories={dropdownCategories?.filter(
					(category) =>
						category.includes(exercise.category) &&
						(categoryNames.includes(category) ||
							(formCategories.has(category) && category !== exercise.category)),
				)}
				onRemove={() => onRemoveExercise(index)}
				onSelectCategory={() => onSelectCategory(index)}
				onSelectUnit={(unit) => onSelectUnit(index, unit)}
				onCreateNewCategory={(value) => onCreateNewCategory(value, index)}
				isCategoryOnMountFocus={!!index}
				units={$units}
				{isLoading}
				{disabledRemoveExerciseTitle}
			/>
		{/each}
		<Button
			type="neutral"
			isPaddingSame
			padding="md"
			on:click={onAddExercise}
			disabledTitle={disabledAddExerciseTitle}
		>
			<!-- Solar nema normalni plus... -->
			<Icon icon="iconoir:plus" />
		</Button>

		<Button
			on:click={onSubmit}
			disabledTitle={!areExercisesFilled ? dictionary.YOU_HAVE_TO_FILL_ALL_FIELDS : undefined}
			><span class="submit">{dictionary.SUBMIT}</span></Button
		>
	</form>
</Modal>

<style lang="scss">
	.form {
		display: flex;

		flex-direction: column;
		align-items: center;
		gap: $space-md;
	}

	.title {
		color: var(--text-primary);
		font-size: $text-heading;

		text-transform: capitalize;
	}

	.submit {
		padding-inline: $space-xl;
	}
</style>
