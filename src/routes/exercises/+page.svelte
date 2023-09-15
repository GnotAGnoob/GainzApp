<script lang="ts">
	import { categories } from "$src/lib/stores/categories";
	import { floatedCorner } from "$src/lib/stores/floatedCorner";
	import Exercises from "$src/components/Exercises/Exercises.svelte";
	import { sortedCategories } from "$src/lib/stores/categories";

	export let data;

	categories.set(data.categories || []);
	$floatedCorner = ["addExercise"];
</script>

<Exercises categories={$sortedCategories} />
