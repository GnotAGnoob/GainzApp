<script lang="ts">
	import Icon from "@iconify/svelte";
	import { onMount } from "svelte";
	import ExerciseForm from "./Exercises/ExerciseForm.svelte";
	import { floatedCorner } from "$src/lib/stores/floatedCorner";
	import type Modal from "./Modals/Modal.svelte";

	const BOUNDARY = 200;

	let isVisible = false;
	let exerciseFormElement: Modal;

	const goToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	const setVisibility = () => {
		isVisible = window.scrollY > BOUNDARY ? true : false;
	};

	onMount(() => {
		setVisibility();
	});
</script>

<svelte:window on:scroll={setVisibility} />

<div class="floatingCorner">
	{#if $floatedCorner.includes("addExercise")}
		<button class="icon" on:click={exerciseFormElement.showModal}>
			<!-- Solar nema normalni plus... -->
			<Icon icon="iconoir:plus" />
		</button>
		<ExerciseForm bind:modalElement={exerciseFormElement} />
	{/if}
	{#if $floatedCorner.includes("addWorkout")}
		<button class="icon">
			<!-- Solar nema normalni plus... -->
			<Icon icon="iconoir:plus" />
		</button>
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

		z-index: 100;
	}

	.icon {
		$dimension: $space-lg + $space-sm;
		border-radius: $border-md;
		box-shadow: $box-shadow;

		width: $dimension;
		height: $dimension;
		min-width: $dimension;
		min-height: $dimension;

		background-color: var(--background-color);

		font-size: $back-to-top;
		line-height: 0;

		&:hover {
			box-shadow: $box-shadow-hover;
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
