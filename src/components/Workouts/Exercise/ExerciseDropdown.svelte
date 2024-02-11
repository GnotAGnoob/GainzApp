<script lang="ts">
	import axios from "axios";
	import InputDropdown from "../../Atoms/Dropdown/InputDropdown.svelte";
	import { debounce } from "debounce";
	import { apiRoutes } from "$src/lib/paths";
	import { DEBOUNCE_TIME, MAX_DROPDOWN_ITEMS } from "$src/lib/constants";
	import toast from "$src/lib/toast";
	import { dictionary } from "$src/lib/language/dictionary";
	import type { PageCreateSupersetExercise } from "$src/routes/workouts/types";
	import type { ExerciseSearchResult } from "$src/routes/api/exercises/search/types";

	const formatExercise = (supersetExercise: Partial<PageCreateSupersetExercise>) => {
		const categoryName = supersetExercise.exercise?.category?.name;
		const exerciseName = supersetExercise.exercise?.name;
		return categoryName ? `${categoryName}${exerciseName ? ` - ${exerciseName}` : ""}` : "";
	};

	export let supersetExercise: Partial<PageCreateSupersetExercise>;
	export let onCancel: () => void;
	export let onConfirm: () => void;

	let value = formatExercise(supersetExercise);
	let dropdownItems: PageCreateSupersetExercise[] = [];

	const fetchDropdownData = async () => {
		try {
			const { data } = await axios.get<ExerciseSearchResult[]>(apiRoutes.exercisesSearch, {
				params: { text: value, limit: MAX_DROPDOWN_ITEMS },
			});
			dropdownItems = data.map((item) => {
				return { exercise: { ...item.exercise, category: item.category, unit: item.unit } };
			});
		} catch (error) {
			toast.error(dictionary.UNKNOWN_ERROR);
		}
	};

	const handleCancel = () => {
		value = formatExercise(supersetExercise);
		onCancel();
	};

	const debounceFetch = debounce(fetchDropdownData, DEBOUNCE_TIME);

	const onSelect = (index: number) => {
		if (dropdownItems.length <= index) return;

		supersetExercise = dropdownItems[index];
		value = formatExercise(supersetExercise);

		onConfirm();
	};

	const onEnterPress = (event: KeyboardEvent) => {
		if (event.key === "Enter") {
			if (!value.length) {
				handleCancel();
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
		onBlur={handleCancel}
		{onFocus}
		{onSelect}
	/>
</div>

<style lang="scss">
	.input {
		background-color: var(--accent-neutral-50);
	}
</style>
