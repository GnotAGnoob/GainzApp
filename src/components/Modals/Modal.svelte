<script lang="ts">
	import Icon from "@iconify/svelte";
	import Button from "../Atoms/Button/Button.svelte";
	import type { Size } from "./types";
	import Portal from "../Portal.svelte";

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
		if (!modalContentElement.contains(event.target as Node)) {
			handleClose();
		}
	};

	$: {
		onOpenChange?.(isOpen);

		if (isOpen) {
			modalElement?.addEventListener("mouseup", onBackdropClick);
			modalElement?.showModal();
		} else {
			modalElement?.removeEventListener("mouseup", onBackdropClick);
			modalElement?.close();
		}
	}
</script>

{#if isOpen}
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
	.modal {
		width: 100%;
		height: 100%;
		max-width: unset;
		max-height: unset;
		border: none;

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
</style>
