<script lang="ts">
	import Exercises from "../components/Exercises/Exercises.svelte";

	export let data;
</script>

<Exercises categories={data.categories} />
