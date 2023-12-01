<script lang="ts">
	import Icon from "@iconify/svelte";
	import Button from "../Atoms/Button/Button.svelte";
	import { onMount } from "svelte";
	import type { Size } from "./types";
	import { modal } from "$src/lib/stores/modal";

	export let size: Size = "md";
	export let isOpened = false;

	let modalElement: HTMLDialogElement;
	let modalContentElement: HTMLDivElement;

	export let onClose: (() => void) | undefined = undefined;

	const handleClose = () => {
		if ($modal.closeDisabledText) return;

		onClose?.();
		modalElement.close();
		window.document.documentElement.classList.remove("stopScrolling");
	};

	const onBackdropClick = (event: MouseEvent) => {
		if (!modalContentElement.contains(event.target as Node)) {
			handleClose();
		}
	};

	onMount(() => {
		modalElement.addEventListener("mouseup", onBackdropClick);

		if (isOpened) {
			modalElement.showModal();
		}

		return () => {
			modalElement.removeEventListener("mouseup", onBackdropClick);
		};
	});

	export const showModal = () => {
		modalElement.showModal();
		window.document.documentElement.classList.add("stopScrolling");
	};

	export const closeModal = () => {
		handleClose();
	};
</script>

<dialog class="modal" bind:this={modalElement}>
	<div class="modalInside modalInside_{size}">
		<div class="modalContent" bind:this={modalContentElement}>
			<div class="close">
				<Button
					on:click={handleClose}
					padding="sm"
					type="noBackground"
					isPaddingSame
					disabledTitle={$modal.closeDisabledText}
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
