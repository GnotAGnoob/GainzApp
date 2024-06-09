<script lang="ts">
	import Icon from "@iconify/svelte";
	import Button from "../Atoms/Button/Button.svelte";
	import type { Size } from "./types";
	import Portal from "../Portal.svelte";
	import { browser } from "$app/environment";
	import type { EventHandler } from "svelte/elements";

	export let size: Size = "md";
	export let isOpen: boolean;
	export let closeDisabledText: string | undefined = undefined;
	/** if defined the outside component handles what happens if backdrop / close button is clicked */
	export let onOpenChange: ((isOpen: boolean) => void) | undefined = undefined;

	let modalElement: HTMLDialogElement | null = null;
	let modalContentElement: HTMLDivElement;

	let isOpenLocal = false;
	let isDialogTransitionReady = false;
	let scrollPadding = 0;

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

	const transitionEndClose = () => {
		isOpenLocal = false;

		if (browser) {
			document.documentElement.style.setProperty("--scrollbar-padding", "0");
		}
	};

	const transitionEndCancel = (event: Event) => {
		event.preventDefault();
		modalElement?.removeEventListener("transitionend", transitionEndClose);
	};

	$: {
		onOpenChange?.(isOpen);

		if (isOpen && !isOpenLocal) {
			isOpenLocal = true;
			scrollPadding = window.innerWidth - document.documentElement.clientWidth;
		} else if (isOpen && isOpenLocal) {
			modalElement?.showModal();

			modalElement?.removeEventListener("transitionend", transitionEndClose);
			modalElement?.removeEventListener("transitioncancel", transitionEndCancel);

			modalElement?.addEventListener("mouseup", onBackdropClick);

			if (browser) {
				document.documentElement.style.setProperty("--scrollbar-padding", `${scrollPadding}px`);
			}

			setTimeout(() => {
				isDialogTransitionReady = true;
			});
		} else if (!isOpen && isOpenLocal) {
			modalElement?.close();

			modalElement?.removeEventListener("mouseup", onBackdropClick);

			setTimeout(() => {
				modalElement?.addEventListener("transitionend", transitionEndClose, { once: true });
				modalElement?.addEventListener("transitioncancel", transitionEndCancel, { once: true });
			});
		} else {
			isDialogTransitionReady = false;
		}
	}

	const handleCancel: EventHandler<Event, HTMLDialogElement> = (event) => {
		event.preventDefault();

		handleClose();
	};
</script>

{#if isOpenLocal || isOpen}
	<Portal target="#modal">
		<dialog
			class="modal"
			bind:this={modalElement}
			class:mounted={isOpen && isOpenLocal && isDialogTransitionReady}
			on:cancel={handleCancel}
		>
			<div class="modalInsideWrapper">
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
			</div>
		</dialog>
	</Portal>
{/if}

<style lang="scss">
	$transition-duration: 2s;

	.modal {
		width: 100%;
		height: 100%;
		max-width: unset;
		max-height: unset;
		border: none;
		transition: overlay $transition-duration ease-out allow-discrete,
			display $transition-duration ease-out allow-discrete;

		background-color: transparent;

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

			&Wrapper {
				display: flex;

				width: 100%;
				height: 100%;

				opacity: 0;
				transform: scale(0.8);

				transition: opacity $transition-duration ease-out, transform $transition-duration ease-out;

				.mounted & {
					opacity: 1;
					transform: scale(1);
				}
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
		}

		&::backdrop {
			background-color: var(--accent-neutral-900);
			opacity: 0;

			transition: display $transition-duration allow-discrete, overlay $transition-duration allow-discrete,
				opacity $transition-duration;
		}
	}

	.mounted {
		&::backdrop {
			opacity: 0.4;
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

	.interactivityDisables {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 9999;
	}
</style>
