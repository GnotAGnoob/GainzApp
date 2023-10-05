<script lang="ts">
	import { page } from "$app/stores";
	import { dictionary } from "$src/lib/language/dictionary";
	import Icon from "@iconify/svelte";
	import Button from "../Atoms/Button/Button.svelte";
	import Input from "../Atoms/Input.svelte";
	import axios from "axios";
	import InputDropdown from "../Atoms/InputDropdown.svelte";
	import toast from "$src/lib/toast";
	import { Modal } from "@svelteuidev/core";
	import { categories, sortedCategories } from "$src/lib/stores/categories";
	import type { Category } from "$src/db/schema/category";
	import type { PageCategory } from "$src/routes/exercises/types";
	import { apiRoutes } from "$src/lib/paths";
	import ErrorText from "../Atoms/ErrorText.svelte";

	const MAX_EXERCISES = 10;

	export let category = "";

	const emptyExercise = {
		category: category,
		name: "",
		unit: "",
		errorMessage: "",
	};
	const lastSelectedValues = {
		category: category,
		unit: "",
	};

	let exercises = [{ ...emptyExercise }];
	$: areExercisesFilled = exercises.every(
		(exercise) => exercise.category.length && exercise.name.length && exercise.unit.length,
	);

	let isAddExerciseOpen = false;

	export const toggleModal = () => {
		isAddExerciseOpen = !isAddExerciseOpen;

		if (!isAddExerciseOpen) {
			exercises = [{ ...emptyExercise }];
		}
	};

	const onSelectUnit = (index: number) => {
		lastSelectedValues.unit = exercises[index].unit;
	};

	const onSelectCategory = (valueIndex: number, inputsIndex: number) => {
		exercises[inputsIndex].errorMessage = "";
		lastSelectedValues.category = $sortedCategories[valueIndex].name;
	};

	const onAddExercise = () => {
		if (exercises.length < MAX_EXERCISES) {
			exercises = [...exercises, { ...emptyExercise, ...lastSelectedValues }];
		}
	};

	const onRemoveExercise = (index: number) => {
		if (exercises.length > 1) {
			exercises = exercises.filter((_, i) => i !== index);
		}
	};

	const onSubmit = async () => {
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
		} catch (error) {
			if (axios.isAxiosError(error)) {
				exercises[
					exercises.length - 1
				].errorMessage = `${error.response?.data}. idk which element/what happened. too lazy to detect errors`;
			}
		}
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

<Modal target="body" opened={isAddExerciseOpen} on:close={toggleModal} size="lg">
	<form class="form">
		<h2 class="title">{dictionary.ADD_NEW_EXERCISES}</h2>
		{#each exercises as exercise, index}
			<div class="inputsWrapper">
				<div class="inputs">
					<div class="input">
						<InputDropdown
							label={dictionary.CATEGORY}
							bind:value={exercise.category}
							onCreateNew={(value) => onCreateNewCategory(value, index)}
							onSelect={(valueIndex) => onSelectCategory(valueIndex, index)}
							dropDownOptions={$sortedCategories?.map((category) => category.name)}
						/>
					</div>
					<div class="input input_unit">
						<InputDropdown
							label={dictionary.UNIT}
							bind:value={exercise.unit}
							onSelect={onSelectUnit}
							dropDownOptions={$page.data?.units?.map((unit) => unit.name)}
							isSelect
						/>
					</div>
					<div class="input input_name">
						<Input bind:value={exercise.name} label={dictionary.EXERCISE_NAME} />
					</div>
					<div class="trash">
						<Button
							type="negative"
							isPaddingSame
							padding="md"
							on:click={() => onRemoveExercise(index)}
							disabledTitle={disabledRemoveExerciseTitle}
						>
							<Icon icon="solar:trash-bin-trash-linear" />
						</Button>
					</div>
				</div>
				{#if exercise.errorMessage.length > 0}
					<ErrorText text={exercise.errorMessage} />
				{/if}
			</div>
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

	.input {
		flex: 1;

		@media (max-width: $bp-512) {
			min-width: 40%;
		}

		&s {
			display: flex;

			flex-wrap: wrap;
			align-items: flex-end;

			width: 100%;
			column-gap: $space-md;
			row-gap: $space-sm;

			@media (min-width: $bp-512) {
				flex-wrap: nowrap;
			}
		}

		&_unit {
			flex: unset;
			min-width: unset;
			width: $space-xxl;
		}
	}

	.submit {
		padding-inline: $space-xl;
	}
</style>
