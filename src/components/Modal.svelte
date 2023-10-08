<script lang="ts">
	import Icon from "@iconify/svelte";
	import Button from "./Atoms/Button/Button.svelte";
	import { onMount } from "svelte";

	export let size: "sm" | "md" | "lg" | "auto" = "md";
	export let isOpened = false;

	let modalElement: HTMLDialogElement;

	export let onClose: (() => void) | undefined = undefined;

	const handleClose = () => {
		onClose?.();
		modalElement.close();
	};

	const onBackdropClick = (event: MouseEvent) => {
		if (event.target === modalElement) {
			handleClose();
		}
	};

	onMount(() => {
		modalElement.addEventListener("click", onBackdropClick);

		if (isOpened) {
			modalElement.showModal();
		}

		return () => {
			modalElement.removeEventListener("click", onBackdropClick);
		};
	});

	export const showModal = () => {
		modalElement.showModal();
	};
</script>

<dialog class="modal" bind:this={modalElement}>
	<div class="modalContent modalContent_{size}">
		<div class="close">
			<Button on:click={handleClose} padding="sm" type="noBackground" isPaddingSame>
				<div class="closeIcon">
					<Icon icon="iconoir:plus" />
				</div>
			</Button>
		</div>
		<slot />
	</div>
</dialog>

<style lang="scss">
	.modal {
		position: relative;

		margin-inline: auto;
		margin-top: 15vh;
		border: none;
		border-radius: $border-md;

		box-shadow: $box-shadow-hover;

		&::backdrop {
			background-color: var(--accent-neutral-900);
			opacity: 0.4;
		}

		&Content {
			padding: $space-md;

			background-color: var(--background-color);

			&_sm {
				width: $space-xxxl;
			}

			&_md {
				width: $space-xxxxl;
			}

			&_lg {
				width: $space-xxxxl + $space-xxxl;
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
</style>
