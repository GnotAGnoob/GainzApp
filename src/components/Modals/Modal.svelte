<script lang="ts">
	import Icon from "@iconify/svelte";
	import Button from "../Atoms/Button/Button.svelte";
	import type { Size } from "./types";
	import Portal from "../Portal.svelte";
	import { browser } from "$app/environment";
	import type { EventHandler } from "svelte/elements";
	import { fade, scale, slide } from "svelte/transition";
	import { DEFAULT_TRANSITION_CONFIG } from "$src/lib/transitions";

	export let size: Size = "md";
	export let isOpen: boolean;
	export let closeDisabledText: string | undefined = undefined;
	/** if defined the outside component handles what happens if backdrop / close button is clicked */
	export let onOpenChange: ((isOpen: boolean) => void) | undefined = undefined;

	let modalElement: HTMLDialogElement | null = null;
	let modalContentElement: HTMLDivElement;

	const localState: "open" | "close" | "ready" | "closing" = "close";
	const scrollPadding = 0;

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

	// const transitionEndClose = () => {
	// 	console.log("transitionEndClose");
	// 	localState = "close";

	// 	if (browser) {
	// 		document.documentElement.style.setProperty("--scrollbar-padding", "0");
	// 	}
	// };

	// const transitionEndCancel = (event: Event) => {
	// 	console.log("transitionEndCancel", event);
	// 	modalElement?.removeEventListener("transitionend", transitionEndClose);
	// };

	// $: {
	// 	onOpenChange?.(isOpen);
	// 	console.log("isOpen", isOpen, localState);

	// 	if (isOpen && localState === "close") {
	// 		localState = "ready";
	// 		// scrollPadding = window.innerWidth - document.documentElement.clientWidth;
	// 	}
	// }

	// $: {
	// 	if (isOpen && localState === "ready") {
	// 		modalElement?.addEventListener("mouseup", onBackdropClick);

	// 		if (browser) {
	// 			document.documentElement.style.setProperty("--scrollbar-padding", `${scrollPadding}px`);
	// 		}

	// 		setTimeout(() => {
	// 			modalElement?.showModal();

	// 			localState = "open";
	// 		});
	// 	}
	// }

	// $: {
	// 	if (isOpen && localState === "open") {
	// 		console.log("opexxxn");
	// 		modalElement?.removeEventListener("transitionend", transitionEndClose);
	// 		modalElement?.removeEventListener("transitioncancel", transitionEndCancel);
	// 	}
	// }

	// $: {
	// 	if (!isOpen && localState === "open") {
	// 		localState = "closing";
	// 		// modalElement?.removeEventListener("mouseup", onBackdropClick);
	// 	}
	// }

	// $: {
	// 	if (!isOpen && localState === "closing") {
	// 		setTimeout(() => {
	// 			modalElement?.addEventListener("transitionend", transitionEndClose, { once: true });
	// 			modalElement?.addEventListener("transitioncancel", transitionEndCancel, { once: true });
	// 		});
	// 	}
	// }

	// $: {
	// 	if (!isOpen && localState === "close") {
	// 		console.log("close");
	// 		modalElement?.close();
	// 	}
	// }

	const handleCancel: EventHandler<Event, HTMLDialogElement> = (event) => {
		event.preventDefault();

		handleClose();
	};

	// const transitionEndClose = () => {
	// 	console.log("transitionEndClose");
	// 	localState = "close";

	// 	if (browser) {
	// 		document.documentElement.style.setProperty("--scrollbar-padding", "0");
	// 	}
	// };

	// const transitionEndCancel = (event: Event) => {
	// 	console.log("transitionEndCancel", event);
	// 	modalElement?.removeEventListener("transitionend", transitionEndClose);
	// };

	// $: {
	// 	console.log("localState", localState);

	// 	onOpenChange?.(isOpen);

	// 	if (isOpen && localState === "close") {
	// 		localState = "ready";

	// 		if (browser) {
	// 			scrollPadding = window.innerWidth - document.documentElement.clientWidth;
	// 		}
	// 	} else if (isOpen && localState === "ready") {
	// 		if (browser) {
	// 			document.documentElement.style.setProperty("--scrollbar-padding", `${scrollPadding}px`);
	// 		}

	// 		modalElement?.showModal();
	// 		localState = "open";
	// 	} else if (localState === "open" && !isOpen) {
	// 		// idk why
	// 		setTimeout(() => {
	// 			localState = "closing";
	// 		});
	// 	} else if (!isOpen && localState === "closing") {
	// 		console.log("closing");
	// 		modalElement?.addEventListener("transitioncancel", transitionEndCancel, { once: true });
	// 		modalElement?.addEventListener("transitionend", transitionEndClose, { once: true });
	// 	}
	// }

	$: if (isOpen) {
		modalElement?.showModal();
		modalElement?.addEventListener("mouseup", onBackdropClick);
	} else {
		modalElement?.removeEventListener("mouseup", onBackdropClick);
	}
</script>

{#if isOpen}
	<Portal target="#modal">
		<dialog
			class="modal"
			bind:this={modalElement}
			on:cancel={handleCancel}
			transition:fade={DEFAULT_TRANSITION_CONFIG}
		>
			<div class="modalBackground" />
			<div class="modalInsideWrapper">
				<div class="modalInside modalInside_{size}">
					<div
						class="modalContent"
						bind:this={modalContentElement}
						transition:scale={{ ...DEFAULT_TRANSITION_CONFIG, start: 0.8, opacity: 1 }}
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
