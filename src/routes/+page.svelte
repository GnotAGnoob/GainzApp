<script lang="ts">
	import { categories } from "$src/lib/stores/categories";
	import Exercises from "../components/Exercises/Exercises.svelte";

	export let data;

	categories.set(data.categories);
</script>

<Exercises categories={$categories} />
