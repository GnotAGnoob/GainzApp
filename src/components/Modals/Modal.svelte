<script lang="ts">
	import { scale } from "svelte/transition";
	import Icon from "@iconify/svelte";
	import Button from "../Atoms/Button/Button.svelte";
	import type { Size } from "./types";
	import Portal from "../Portal.svelte";
	import { DEFAULT_TRANSITION_CONFIG } from "$src/lib/transitions";

	export let size: Size = "md";
	export let isOpen: boolean;
	export let closeDisabledText: string | undefined = undefined;
	/** if defined the outside component handles what happens if backdrop / close button is clicked */
	export let onOpenChange: ((isOpen: boolean) => void) | undefined = undefined;

	let isLocalOpen = false;

	let modalElement: HTMLDialogElement | null = null;
	let modalContentElement: HTMLDivElement;

	const handleClose = () => {
		if (closeDisabledText) return;

		if (onOpenChange) {
			onOpenChange(false);
			return;
		}

		isOpen = false;
	};

	const onBackdropClick = (event: MouseEvent) => {
		if (!modalContentElement.contains(event.target as Node)) {
			handleClose();
		}
	};

	$: {
		onOpenChange?.(isOpen);

		if (isOpen) {
			modalElement?.addEventListener("mouseup", onBackdropClick);
			modalElement?.showModal();
			isLocalOpen = true;
		} else {
			modalElement?.removeEventListener("mouseup", onBackdropClick);
			modalElement?.close();

			modalElement?.addEventListener("animationend", () => {
				isLocalOpen = false;
			});
		}
	}
</script>

{#if isOpen || isLocalOpen}
	<Portal target="#modal">
		<dialog class="modal" bind:this={modalElement}>
			<div class="modalInside modalInside_{size}">
				<div class="modalContent" bind:this={modalContentElement}>
					<div class="close">
						<Button
							on:click={handleClose}
							padding="sm"
							type="noBackground"
							isPaddingSame
							disabledTitle={closeDisabledText}
						>
							<div class="closeIcon">
								<Icon icon="iconoir:plus" />
							</div>
						</Button>
					</div>
					<slot />
				</div>
			</div>
		</dialog>
	</Portal>
{/if}

<style lang="scss">
	$transition: 2s;

	.modal {
		width: 100%;
		height: 100%;
		max-width: unset;
		max-height: unset;
		border: none;

		background-color: transparent;

		opacity: 0;
		transition: opacity $transition ease-out, overlay $transition ease-out allow-discrete,
			display $transition ease-out allow-discrete;

		&Inside {
			margin-inline: auto;
			margin-top: 15vh;
			margin-bottom: $space-xl;
			max-width: 100%;

			width: fit-content;

			&_sm {
				width: $space-xxxl + $space-xxl;
			}

			&_md {
				width: $space-xxxxl;
			}

			&_lg {
				width: $space-xxxxl + $space-xxxl;
			}
		}

		&Content {
			position: relative;

			margin-inline: min($space-xl, 2.5vw);
			border-radius: $border-md;
			padding: $space-md;
			padding-top: $space-lg;

			background-color: var(--background-color);
			box-shadow: $box-shadow;

			transform: scale(0.8);
			transition: transform $transition ease-out;
		}

		&[open] &Content {
			animation: fade-in $transition ease-out;
			transform: scale(1);
		}

		&::backdrop {
			background-color: var(--accent-neutral-900);
			opacity: 0;

			transition: display $transition allow-discrete, overlay $transition allow-discrete, opacity $transition;
		}

		&[open] {
			opacity: 1;

			&::backdrop {
				opacity: 0.4;
				animation: backdrop-fade-in $transition ease-out;
			}
		}
	}

	.close {
		position: absolute;

		right: $space-xs;
		top: $space-xs;

		&Icon {
			font-size: $icon-xl;
			line-height: 0;
			transform: rotate(45deg);
		}
	}

	/* Animation keyframes */

	@keyframes fade-in {
		0% {
			opacity: 0;
			transform: scale(0.8);
		}

		100% {
			opacity: 1;
			transform: scale(1);
		}
	}

	@keyframes backdrop-fade-in {
		0% {
			opacity: 0;
		}

		100% {
			opacity: 0.4;
		}
	}
</style>
