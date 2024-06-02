<script lang="ts">
	import Error from "./Error.svelte";

	export let title: string | number | undefined = undefined;
	export let message: string | undefined = undefined;
	export let isRefreshButton: boolean | undefined = undefined;
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
