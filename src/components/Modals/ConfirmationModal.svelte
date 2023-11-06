<script lang="ts">
	import Button from "../Atoms/Button/Button.svelte";
	import Modal from "./Modal.svelte";
	import type { Size } from "./types";
	import { dictionary } from "$src/lib/language/dictionary";

	export let text: string | undefined = undefined;
	export let size: Size = "sm";
	export let onConfirm: (() => void) | undefined = undefined;
	export let onCancel: (() => void) | undefined = undefined;

	let modal: Modal;

	export const showModal = () => {
		modal.showModal();
	};

	const handleCancel = () => {
		onCancel?.();
		modal.closeModal();
	};

	const handleConfirm = () => {
		onConfirm?.();
		modal.closeModal();
	};
</script>

<Modal {size} bind:this={modal} onClose={onCancel}>
	<div class="modal">
		{#if text}
			<h2 class="text">{text}</h2>
		{/if}
		<slot />
		<div class="buttons">
			<Button type="negativeNoBackground" on:click={handleCancel}>
				{dictionary.CANCEL}
			</Button>
			<Button type="positive" on:click={handleConfirm}>
				{dictionary.CONFIRM}
			</Button>
		</div>
	</div>
</Modal>

<style lang="scss">
	.text {
		text-transform: none;
		text-align: center;
	}

	.buttons {
		display: flex;

		margin-top: $space-lg;

		justify-content: center;
		gap: $space-sm;
	}
</style>
