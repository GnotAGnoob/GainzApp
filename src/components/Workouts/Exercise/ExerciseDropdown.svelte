<script lang="ts">
	import axios from "axios";
	import debounce from "debounce";
	import { apiRoutes } from "$src/lib/paths";
	import { DEBOUNCE_TIME, MAX_DROPDOWN_ITEMS, MAX_DROPDOWN_SEARCH_LENGTH } from "$src/lib/constants";
	import toast from "$src/lib/toast";
	import { dictionary } from "$src/lib/language/dictionary";
	import type { PageCreateSupersetExercise } from "$src/routes/types";
	import type { ExerciseSearchResult } from "$src/routes/api/exercises/search/types";
	import { InputSelect, InputSelectItem } from "$src/components/Atoms/Selects/InputSelect";
	import type { SelectType } from "$src/components/Atoms/Selects/types";
	import { onMount } from "svelte";
	import type { OnMountBehaviour } from "$src/components/Atoms/types";

	const formatExercise = (supersetExercise: Partial<PageCreateSupersetExercise>) => {
		const categoryName = supersetExercise.exercise?.category?.name;
		const exerciseName = supersetExercise.exercise?.name;
		return categoryName ? `${categoryName}${exerciseName ? ` - ${exerciseName}` : ""}` : "";
	};

	export let supersetExercise: Partial<PageCreateSupersetExercise>;
	export let onCancel: () => void;
	export let onSelect: ((supersetExercise: PageCreateSupersetExercise) => void) | undefined = undefined;
	export let onMountBehaviour: OnMountBehaviour = "none";

	let value = formatExercise(supersetExercise);
	let dropdownItems: PageCreateSupersetExercise[] = [];

	onMount(() => {
		fetchDropdownData();
	});

	const fetchDropdownData = async () => {
		try {
			const { data } = await axios.get<ExerciseSearchResult[]>(apiRoutes.exercisesSearch, {
				params: { text: value.trim(), limit: MAX_DROPDOWN_ITEMS },
			});
			dropdownItems = data.map((item) => {
				return { exercise: { ...item.exercise, category: item.category, unit: item.unit } };
			});
		} catch (error) {
			toast.error(dictionary.UNKNOWN_ERROR);
		}
	};

	const debounceFetch = debounce(fetchDropdownData, DEBOUNCE_TIME);

	const handleSelect = (selectedValue: SelectType<PageCreateSupersetExercise>) => {
		if (!selectedValue) return;

		let selectedSupersetExercise: PageCreateSupersetExercise;

		if (Array.isArray(selectedValue)) {
			selectedSupersetExercise = selectedValue[0].value;
		} else {
			selectedSupersetExercise = selectedValue.value;
		}

		supersetExercise = selectedSupersetExercise;
		value = formatExercise(selectedSupersetExercise);
		onSelect?.(selectedSupersetExercise);
	};

	const onOpenChange = (isOpen: boolean) => {
		if (!isOpen) {
			value = formatExercise(supersetExercise);
			onCancel();
			return;
		} else {
			fetchDropdownData();
		}
	};

	$: if (value.length) {
		debounceFetch();
	}
</script>

<div class="input">
	<InputSelect
		bind:inputValue={value}
		onSelectedChange={handleSelect}
		{onOpenChange}
		{onMountBehaviour}
		maxTextLength={MAX_DROPDOWN_SEARCH_LENGTH}
	>
		{#each dropdownItems as item (item.exercise.id)}
			<InputSelectItem value={item}>{formatExercise(item)}</InputSelectItem>
		{/each}
	</InputSelect>
</div>

<style lang="scss">
	.input {
		background-color: var(--accent-neutral-50);
	}
</style>
