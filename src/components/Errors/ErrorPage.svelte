<!-- dev component for seeing all the color variables -->
<script lang="ts">
	import Error from "./Error.svelte";
	import { dictionary } from "$src/lib/language/dictionary";

	export let title: string | number = dictionary.OOOPS_SOMETHING_WENT_WRONG;
	export let message: string = dictionary.UNKNOWN_ERROR;
	export let isRefreshButton = true;
</script>

<div class="wrapper">
	<Error {title} {message} {isRefreshButton} />
</div>

<style lang="scss">
	.wrapper {
		display: flex;

		width: 100%;
		height: 100%;
		padding-block: $space-lg;
		flex: 1;

		align-items: center;
	}
</style>
