<script lang="ts">
	import axios from "axios";
	import InputDropdown from "../Atoms/InputDropdown.svelte";
	import { debounce } from "debounce";
	import { apiRoutes } from "$src/lib/paths";
	import { DEBOUNCE_TIME, MAX_DROPDOWN_ITEMS } from "$src/lib/constants";
	import toast from "$src/lib/toast";
	import { dictionary } from "$src/lib/language/dictionary";
	import type { PageFullExercise } from "$src/routes/workouts/types";

	// todo put into types use on be and check right usage of optional thne in other components too

	const formatExercise = (exercise: PageFullExercise) => {
		const categoryName = exercise.category.name;
		const exerciseName = exercise.exercise?.name;
		return categoryName ? `${categoryName}${exerciseName ? ` - ${exerciseName}` : ""}` : "";
	};

	export let exercise: PageFullExercise;
	export let onCancel: () => void;
	export let onConfirm: () => void;

	let value = formatExercise(exercise);
	let dropdownItems: PageFullExercise[] = [];

	const fetchDropdownData = async () => {
		try {
			// todo, aby na prazdny string hazel nejake vysledky
			const { data } = await axios.get<PageFullExercise[]>(apiRoutes.exercisesSearch, {
				params: { text: value, limit: MAX_DROPDOWN_ITEMS },
			});
			dropdownItems = data;
		} catch (error) {
			toast.error(dictionary.UNKNOWN_ERROR);
		}
	};

	const debounceFetch = debounce(fetchDropdownData, DEBOUNCE_TIME);

	const onSelect = (index: number) => {
		if (dropdownItems.length <= index) return;
		// todo propojit z fetchnutyma itemama
		exercise = dropdownItems[index];
		value = formatExercise(exercise);

		onConfirm();
	};

	const onEnterPress = (event: KeyboardEvent) => {
		if (event.key === "Enter") {
			if (!value.length) {
				onCancel();
				return;
			}

			if (!dropdownItems.length) return;

			onSelect(0);
			return;
		}

		debounceFetch();
	};

	const onFocus = () => {
		fetchDropdownData();
	};
</script>

<div class="input">
	<InputDropdown
		dropDownOptions={dropdownItems.map(formatExercise)}
		isOnMountFocus
		bind:value
		on:keyup={onEnterPress}
		on:blur={onCancel}
		{onFocus}
		{onSelect}
	/>
</div>

<style lang="scss">
	.input {
		background-color: var(--accent-neutral-50);
	}
</style>
