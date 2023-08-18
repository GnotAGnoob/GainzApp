<script lang="ts">
	import Icon from "@iconify/svelte";

	const BOUNDARY = 200;

	let isVisible = false;

	const goToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	const setVisibility = () => {
		isVisible = window.scrollY > BOUNDARY ? true : false;
	};
</script>

<svelte:window on:scroll={setVisibility} />

<button class="icon" class:icon_visible={isVisible} on:click={goToTop}>
	<Icon icon="solar:alt-arrow-up-linear" />
</button>

<style lang="scss">
	.icon {
		$transition: 0.3s ease-in-out;

		position: fixed;

		padding: $space-sm;
		border: $space-xxs solid var(--accent-neutral-200);
		border-radius: $border-md;

		bottom: -$space-xxl;
		right: $space-md;

		background-color: var(--background-color);

		font-size: $back-to-top;
		line-height: 0;

		opacity: 0;
		z-index: 50;

		transition: bottom $transition, opacity $transition;

		&:hover {
			border-color: var(--text-primary--hover);
		}

		&_visible {
			opacity: 1;
			bottom: $space-md;
		}
	}
</style>
