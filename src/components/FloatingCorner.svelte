<script lang="ts">
	import Icon from "@iconify/svelte";
	import { page } from "$app/stores";
	import { Modal } from "@svelteuidev/core";
	import { onMount } from "svelte";

	const BOUNDARY = 200;

	let isVisible = false;
	let isAddExerciseOpen = false;

	const goToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	const setVisibility = () => {
		isVisible = window.scrollY > BOUNDARY ? true : false;
	};

	const switchAddExerciseModal = () => {
		isAddExerciseOpen = !isAddExerciseOpen;
	};

	onMount(() => {
		setVisibility();
	});
</script>

<svelte:window on:scroll={setVisibility} />

<div class="floatingCorner">
	{#if $page.data.floatedCorner?.includes("addExercise")}
		<button class="icon" on:click={switchAddExerciseModal}>
			<!-- Solar nema normalni plus... -->
			<Icon icon="iconoir:plus" />
		</button>
		<Modal target="body" opened={isAddExerciseOpen} on:close={switchAddExerciseModal}>ahoj</Modal>
	{/if}
	<div class="animated" class:animated_invisible={!isVisible}>
		<button class="icon" on:click={goToTop}>
			<Icon icon="solar:alt-arrow-up-linear" />
		</button>
	</div>
</div>

<style lang="scss">
	.floatingCorner {
		display: flex;
		position: fixed;

		bottom: $space-md;
		right: $space-md;
		justify-content: flex-end;

		z-index: 50;
	}

	.icon {
		padding: $space-sm;
		// border: $space-xxs solid var(--accent-neutral-200);
		border-radius: $border-md;
		box-shadow: 0 0 $space-sm var(--accent-neutral-300);

		background-color: var(--background-color);

		font-size: $back-to-top;
		line-height: 0;

		&:hover {
			border-color: var(--text-primary--hover);
		}
	}

	.animated {
		$transition: 0.3s linear;
		$margin: $space-xs;

		display: flex;

		width: 100%;

		justify-content: flex-end;

		transition: width $transition, margin-left $transition, opacity $transition, transform $transition;

		&:not(:first-child) {
			margin-left: $space-sm;
		}

		&_invisible {
			width: 0;
			margin-left: 0 !important;

			opacity: 0;
			transform: translateY($space-xl);
		}
	}
</style>
