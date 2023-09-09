<script lang="ts">
	import { dictionary } from "$src/lib/language/dictionary";
	import Icon from "@iconify/svelte";
	import Button from "../Atoms/Button.svelte";
	import Input from "../Atoms/Input.svelte";
	import axios from "axios";
	import InputDropdown from "../Atoms/InputDropdown.svelte";
	import toast from "$src/lib/toast";

	const MAX_EXERCISES = 10;

	const emptyExercise = {
		category: "",
		name: "",
		unit: "",
	};

	$: exercises = [{ ...emptyExercise }];

	const onAddExercise = () => {
		if (exercises.length < MAX_EXERCISES) {
			exercises = [...exercises, { ...emptyExercise }];
		}
	};

	const onRemoveExercise = (index: number) => {
		if (exercises.length > 1) {
			exercises = exercises.filter((_, i) => i !== index);
		}
	};

	const onSubmit = async () => {
		// const response = await axios.post("/api/exercise", exercises);

		// const total = await response.json();

		console.log(exercises);
	};

	const onCreateNewCategory = (value: string) => {
		return new Promise<void>((resolve, reject) => {
			try {
				const response = axios.post("/api/category", value);

				// todo add to category list

				toast.success(`${dictionary.CATEGORY} ${dictionary.SUCCESSFULLY_CREATED}`);
				resolve();
			} catch (error) {
				toast.success("Exercise created");
				reject(error);
			}
		});
	};
</script>

<form class="form">
	<h2 class="title">{dictionary.ADD_NEW_EXERCISES}</h2>
	{#each exercises as exercise, index (exercise)}
		<div class="inputs">
			<div class="input">
				<InputDropdown
					label={dictionary.CATEGORY}
					bind:value={exercise.category}
					onCreateNew={onCreateNewCategory}
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
				/>
			</div>
			<div class="input"><Input bind:value={exercise.name} label={dictionary.EXERCISE_NAME} /></div>
			<div class="input">
				<InputDropdown
					label={dictionary.UNIT}
					bind:value={exercise.unit}
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
	{/each}
	<Button
		type="neutral"
		isPaddingSame
		padding="sm"
		on:click={onAddExercise}
		isDisabled={exercises.length === MAX_EXERCISES}
	>
		<!-- Solar nema normalni plus... -->
		<Icon icon="iconoir:plus" />
	</Button>

	<Button on:click={onSubmit}><span class="submit">{dictionary.SUBMIT}</span></Button>
</form>

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

		&s {
			display: flex;

			width: 100%;
			gap: $space-md;

			align-items: flex-end;
		}
	}

	.submit {
		padding-inline: $space-xl;
	}
</style>
