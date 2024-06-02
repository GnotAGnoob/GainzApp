<!-- dev component for seeing all the color variables -->
<script lang="ts">
	import { dictionary } from "$src/lib/language/dictionary";
	import Icon from "@iconify/svelte";
	import Button from "../Atoms/Button/Button.svelte";

	export let title: string | number = dictionary.OOOPS_SOMETHING_WENT_WRONG;
	export let message: string = dictionary.UNKNOWN_ERROR;
	export let isRefreshButton = true;

	const handleClick = () => {
		location.reload();
	};
</script>

<div class="wrapper">
	<div class="text">
		<h1 class="title">{title}</h1>
		<p class="message">{message}</p>
	</div>

	{#if isRefreshButton}
		<Button on:click={handleClick} type="neutral">
			<div class="button">
				<Icon icon="iconoir:refresh" />{dictionary.REFRESH_PAGE}
			</div>
		</Button>
	{/if}
</div>

<style lang="scss">
	.wrapper {
		display: flex;

		width: 100%;

		flex-direction: column;
		align-items: center;

		gap: $space-lg;
	}

	.text {
		display: flex;

		flex-direction: column;
		align-items: center;

		gap: $space-sm;
	}

	.title {
		font-size: $text-lg;

		color: var(--accent-negative-600);
	}

	.message {
		font-size: $text-heading;
	}

	.button {
		display: flex;

		gap: $space-sm;

		align-items: flex-end;
	}
</style>
