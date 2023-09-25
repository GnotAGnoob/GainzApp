<script lang="ts">
	import axios from "axios";
	import InputDropdown from "../Atoms/InputDropdown.svelte";
	import EditButtons from "../EditButtons.svelte";
	import Exercise from "./Exercise.svelte";
	import { debounce } from "debounce";
	import { apiRoutes } from "$src/lib/paths";
	import { DEBOUNCE_TIME, MAX_DROPDOWN_ITEMS } from "$src/lib/constants";
	import toast from "$src/lib/toast";
	import { dictionary } from "$src/lib/language/dictionary";
	import type { Category } from "$src/db/schema/category";
	import type { Exercise as ExerciseType } from "$src/db/schema/exercise";

	// todo put into types use on be and check right usage of optional thne in other components too
	type DropdownItem = {
		category: Category;
		exercise: ExerciseType;
	};

	const random = {
		category: { name: "category", id: 1 },
		exercise: { name: "name", id: 2 },
	};

	const formatExercise = (exercise: DropdownItem) => {
		const categoryName = exercise.category.name;
		const exerciseName = exercise.exercise.name;
		return categoryName ? `${categoryName}${exerciseName ? ` - ${exerciseName}` : ""}` : "";
	};

	let exercise = { ...random };

	let value = formatExercise(exercise);
	let isInEditMode = !exercise.category?.name.length;
	let dropdownItems: DropdownItem[] = [];

	const onClick = () => {
		isInEditMode = true;
	};

	const fetchDropdownData = async () => {
		console.log("fetching");
		try {
			const { data } = await axios.get<DropdownItem[]>(apiRoutes.exercisesSearch, {
				params: { text: value, limit: MAX_DROPDOWN_ITEMS },
			});
			dropdownItems = data;
		} catch (error) {
			toast.error(dictionary.UNKNOWN_ERROR);
		}
	};

	const debounceFetch = debounce(fetchDropdownData, DEBOUNCE_TIME);

	const onConfirm = (index: number) => {
		// todo propojit z fetchnutyma itemama
		exercise = { ...random };
		isInEditMode = false;
	};

	const onEnterPress = (event: KeyboardEvent) => {
		console.log(event);
		if (event.key === "Enter") {
			// todo najit ktery souhlasi s value
			onConfirm(0);
			return;
		}

		debounceFetch();
	};

	const onDelete = () => {};

	const onBlur = () => {
		// todo check if value is valid
	};

	const onFocus = () => {
		// todo check fetch drodpown
	};
</script>

{#if isInEditMode}
	<div class="input">
		<InputDropdown
			dropDownOptions={dropdownItems.map(formatExercise)}
			isOnMountFocus
			bind:value
			on:keyup={onEnterPress}
			on:blur={onBlur}
			onSelect={onConfirm}
		/>
	</div>
{:else}
	<button class="button" on:click={onClick}>
		<div class="exercise">
			<Exercise {exercise} />
		</div>
		<div class="edit">
			<EditButtons
				bind:isInEditMode
				isConfirmButton={false}
				{onDelete}
				isAbsolute={false}
				isPadding={false}
				buttonType="noBackground_2"
			/>
		</div>
	</button>
{/if}

<style lang="scss">
	@import "./workouts.scss";

	.button {
		display: flex;

		justify-content: space-between;
		align-items: center;
		gap: $space-sm;

		margin-right: -$card-side-padding + $space-sm;
	}

	.exercise {
		flex: 1;
	}

	.input {
		background-color: var(--accent-neutral-50);

		margin-top: $space-xs;
	}

	.edit {
		align-self: flex-start;
	}
</style>
