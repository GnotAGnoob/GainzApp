<script lang="ts">
	import Icon from "@iconify/svelte";
	import Button from "../Atoms/Button/Button.svelte";
	import { Menu } from "@svelteuidev/core";
	import { signOut } from "@auth/sveltekit/client";
	import { dictionary } from "$src/lib/language/dictionary";
	import { session } from "$src/lib/stores/session";

	export let className = "";
	export { className as class };

	let imageError = false;
</script>

<div class="wrapper {className}">
	<Menu class="menu" placement="center" gutter={14}>
		<div slot="control">
			<Button class="profileButton" borderRadius="round" isPaddingSame padding="sm" type="neutral">
				{#if $session?.user?.image && !imageError}
					<img class="image" src={$session.user.image} alt="profile" on:error={() => (imageError = true)} />
				{:else}
					<div class="profileIcon">
						<Icon icon="solar:user-bold" />
					</div>
				{/if}
			</Button>
		</div>
		<Menu.Item on:click={signOut}>
			<div class="button">
				<div class="buttonIcon">
					<Icon icon="solar:logout-2-linear" />
				</div>
				{dictionary.SIGN_OUT}
			</div>
		</Menu.Item>
	</Menu>
</div>

<style lang="scss">
	$icon-md-size: $space-lg;

	:global(.svelteui-Menu-body) {
		padding: 0;
		border: unset;

		background-color: var(--background-color-toast);
		color: var(--text-primary);

		box-shadow: $box-shadow;
	}

	:global(.svelteui-MenuItem-root) {
		padding: $space-md $space-lg;
		border-radius: 0;
	}

	:global(.svelteui-MenuItem-root.itemHovered) {
		background-color: var(--accent-neutral-100);
	}

	.wrapper {
		display: flex;

		height: 100%;
		min-height: 0;

		:global(.profileButton) {
			width: $icon-md-size;
			height: $icon-md-size;

			place-items: center;
			place-content: center;

			overflow: hidden;
		}

		.profileIcon {
			margin-top: $space-px * 2;
		}
	}

	.button {
		display: flex;

		gap: $space-md;
		align-items: center;

		.buttonIcon {
			font-size: $icon-xl;

			margin-top: $space-px * 2;

			color: var(--text-secondary);
		}
	}

	.image {
		cursor: pointer;

		&:hover {
			filter: brightness(0.9);
		}

		&:active {
			filter: brightness(0.8);
		}
	}
</style>
