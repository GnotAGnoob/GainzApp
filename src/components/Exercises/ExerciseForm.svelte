<script lang="ts">
	import { dictionary } from "$src/lib/language/dictionary";
	import Icon from "@iconify/svelte";
	import Button from "../Atoms/Button.svelte";
	import Input from "../Atoms/Input.svelte";
	import axios from "axios";
	import InputDropdown from "../Atoms/InputDropdown.svelte";
	import toast from "$src/lib/toast";
	import { Modal } from "@svelteuidev/core";
	import { categories } from "$src/lib/stores/categories";

	const MAX_EXERCISES = 10;

	const emptyExercise = {
		category: "",
		name: "",
		unit: "",
		errorMessage: "",
	};
	const lastSelectedValues = {
		category: "",
		unit: "",
	};

	let exercises = [{ ...emptyExercise }];
	$: areExercisesFilled = !exercises.every(
		(exercise) => exercise.category.length && exercise.name.length && exercise.unit.length,
	);

	let isAddExerciseOpen = false;

	export const toggleModal = () => {
		isAddExerciseOpen = !isAddExerciseOpen;

		if (!isAddExerciseOpen) {
			exercises = [{ ...emptyExercise }];
		}
	};

	const onSelectUnit = (value: string) => {
		lastSelectedValues.unit = value;
	};

	const onSelectCategory = (value: string, index: number) => {
		exercises[index].errorMessage = "";
		lastSelectedValues.category = value;
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
		exercises = exercises.map((exercise) => ({ ...exercise, errorMessage: "" }));
		// const response = await axios.post("/api/exercise", exercises);
		// const total = await response.json();
		// console.log($page.data.);
	};

	const onCreateNewCategory = (value: string, index: number) => {
		return new Promise<void>((resolve, reject) => {
			const fetchData = async () => {
				try {
					exercises[index].errorMessage = "";

					// todo send just id
					const response = await toast.promise(axios.post("/api/category", value), {
						loading: `${dictionary.CREATING} ${dictionary.CATEGORY}`,
						success: `${dictionary.CATEGORY} ${dictionary.SUCCESSFULLY_CREATED}`,
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
</script>

<Modal target="body" opened={isAddExerciseOpen} on:close={toggleModal} size="lg">
	<form class="form">
		<h2 class="title">{dictionary.ADD_NEW_EXERCISES}</h2>
		{#each exercises as exercise, index (exercise)}
			<div class="inputsWrapper">
				<div class="inputs">
					<div class="input">
						<InputDropdown
							label={dictionary.CATEGORY}
							bind:value={exercise.category}
							onCreateNew={(value) => onCreateNewCategory(value, index)}
							onSelect={(value) => onSelectCategory(value, index)}
							dropDownOptions={$categories?.map((category) => category.name)}
						/>
					</div>
					<div class="input input_unit">
						<InputDropdown
							label={dictionary.UNIT}
							bind:value={exercise.unit}
							onSelect={onSelectUnit}
							dropDownOptions={[
								"test",
								"test2",
								"test3",
								"test4",
								"test5",
								"test6",
								"test7",
								"test8",
								"test9",
								"test10",
							]}
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
							isDisabled={exercises.length === 1}
						>
							<Icon icon="solar:trash-bin-trash-linear" />
						</Button>
					</div>
				</div>
				{#if exercise.errorMessage.length > 0}
					<p class="error">* {exercise.errorMessage}</p>
				{/if}
			</div>
		{/each}
		<Button
			type="neutral"
			isPaddingSame
			padding="md"
			on:click={onAddExercise}
			isDisabled={exercises.length === MAX_EXERCISES}
		>
			<!-- Solar nema normalni plus... -->
			<Icon icon="iconoir:plus" />
		</Button>

		<Button on:click={onSubmit} isDisabled={areExercisesFilled}
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

	.error {
		margin-top: $space-xs;

		color: var(--accent-negative-500);
		font-size: $text-subheading;
		font-weight: 700;
	}
</style>
