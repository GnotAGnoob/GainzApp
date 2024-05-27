<script lang="ts">
	import { dictionary } from "$src/lib/language/dictionary";
	import Icon from "@iconify/svelte";
	import Button from "../Atoms/Button/Button.svelte";
	import Input from "../Atoms/Input.svelte";
	import ErrorText from "../Atoms/ErrorText.svelte";
	import InputSelect from "../Atoms/Selects/InputSelect/InputSelect.svelte";
	import InputSelectItem from "../Atoms/Selects/InputSelect/InputSelectItem.svelte";
	import type { Exercise } from "./Exercises";
	import type { SelectType } from "../Atoms/Selects/types";
	import { Select, SelectItem } from "../Atoms/Selects/Select";
	import type { Unit } from "$src/db/schema/unit";

	export let exercise: Exercise;
	export let units: Unit[] = [];
	export let onRemove: () => void;
	export let onSelectCategory: (category: SelectType<string>) => void;
	export let onSelectUnit: (unit: SelectType<Unit>) => void;
	export let onCreateNewCategory: (value: string) => void;
	export let isLoading: boolean;
	export let categories: string[];
	export let disabledRemoveExerciseTitle: string | undefined;
	export let isCategoryOnMountFocus = false;

	$: isCreateButtonHidden = !exercise.category.length || categories.includes(exercise.category);

	const handleCreateNew = () => {
		onCreateNewCategory(exercise.category);
	};
</script>

<div class="inputsWrapper">
	<div class="inputs">
		<div class="input">
			<InputSelect
				bind:inputValue={exercise.category}
				label={dictionary.CATEGORY}
				onMountBehaviour={!exercise.category && isCategoryOnMountFocus ? "focus" : "none"}
				onSelectedChange={onSelectCategory}
			>
				{#each categories as category (category)}
					<InputSelectItem value={category}>{category}</InputSelectItem>
				{/each}

				<svelte:fragment slot="bottom">
					{#if !isCreateButtonHidden}
						<Button isFullSize type="neutral" borderRadius="none" on:click={handleCreateNew} {isLoading}>
							<span>{dictionary.CREATE} "{exercise.category}"</span>
						</Button>
					{/if}
				</svelte:fragment>
			</InputSelect>
		</div>
		<div class="input input_unit">
			<Select selected={exercise.unit} label={dictionary.UNIT} onSelectedChange={onSelectUnit}>
				{#each units as unit (unit.name)}
					<SelectItem value={unit}>{unit.name}</SelectItem>
				{/each}
			</Select>
		</div>
		<div class="input input_name">
			<Input
				bind:value={exercise.name}
				label={dictionary.EXERCISE_NAME}
				onMountBehaviour={exercise.category ? "focus" : "none"}
			/>
		</div>
		<div class="trash">
			<Button
				type="negative"
				isPaddingSame
				padding="md"
				on:click={onRemove}
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

<style lang="scss">
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

			&Wrapper {
				max-width: $space-xxxxl + $space-xxl;
			}
		}

		&_unit {
			flex: unset;
			min-width: unset;
			width: $space-xxl;
		}
	}
</style>
