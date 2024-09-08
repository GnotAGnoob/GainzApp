<script lang="ts">
	import Icon from "@iconify/svelte";
	import Button from "../Atoms/Button/Button.svelte";
	import type { Size } from "./types";
	import Portal from "../Portal.svelte";
	import type { EventHandler } from "svelte/elements";
	import { fade, scale } from "svelte/transition";
	import { TRANSITION_CONFIG, TRANSITION_DURATION_FAST } from "$src/lib/transitions";
	import { browser } from "$app/environment";

	export let size: Size = "md";
	export let isOpen: boolean;
	export let closeDisabledText: string | undefined = undefined;
	/** if defined the outside component handles what happens if backdrop / close button is clicked */
	export let onOpenChange: ((isOpen: boolean) => void) | undefined = undefined;

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
		event.preventDefault();
		if (!modalContentElement.contains(event.target as Node)) {
			handleClose();
		}
	};

	const handleCancel: EventHandler<Event, HTMLDialogElement> = (event) => {
		event.preventDefault();

		handleClose();
	};

	const scrollPadding = browser && window.innerWidth - document.documentElement.clientWidth;

	$: if (isOpen && modalElement) {
		modalElement.showModal();
		modalElement.addEventListener("mouseup", onBackdropClick);

		if (browser) {
			document.documentElement.style.setProperty("--scrollbar-padding", `${scrollPadding}px`);
		}
	} else if (modalElement) {
		modalElement.removeEventListener("mouseup", onBackdropClick);
	} else {
		if (browser) {
			document.documentElement.style.setProperty("--scrollbar-padding", "0px");
		}
	}
</script>

{#if isOpen}
	<Portal target="#modal">
		<dialog
			class="modal"
			bind:this={modalElement}
			on:cancel={handleCancel}
			transition:fade={{ ...TRANSITION_CONFIG, duration: TRANSITION_DURATION_FAST }}
		>
			<div class="modalBackground" />
			<div class="modalInsideWrapper">
				<div class="modalInside modalInside_{size}">
					<div class="modalMargins">
						<div
							class="modalContent"
							bind:this={modalContentElement}
							transition:scale={{
								...TRANSITION_CONFIG,
								duration: TRANSITION_DURATION_FAST,
								start: 0.8,
								opacity: 1,
							}}
						>
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
			</div>
		</dialog>
	</Portal>
{/if}

<style lang="scss">
	.modal {
		width: 100%;
		height: 100%;
		max-width: unset;
		max-height: unset;
		border: none;
		background-color: transparent;

		&Background {
			position: fixed;
			inset: 0;
			background-color: var(--accent-neutral-900);
			opacity: 0.4;
		}

		&Inside {
			margin-inline: auto;
			max-width: 100%;

			width: fit-content;

			&_sm {
				width: $space-xxxl + $space-xxl;
			}

			&_md {
				width: $space-xxxxl;
			}

			&_lg {
				width: $space-5xl;
			}

			&Wrapper {
				display: flex;

				width: 100%;
				height: 100%;
			}
		}

		&Content {
			position: relative;

			border-radius: $border-md;
			padding: $space-md;
			padding-top: $space-lg;

			background-color: var(--background-color);
			box-shadow: $box-shadow;
		}

		&Margins {
			padding: 15vh min($space-xl, 2.5vw) $space-xl;
		}

		&::backdrop {
			background-color: transparent;
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
</style>
