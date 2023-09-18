<script lang="ts">
	import Icon from "@iconify/svelte";
	import Button from "../Atoms/Button/Button.svelte";
	import { Menu } from "@svelteuidev/core";
	import { signOut } from "@auth/sveltekit/client";
	import { dictionary } from "$src/lib/language/dictionary";
	import { session } from "$src/lib/stores/session";

	export let className = "";
	export { className as class };
</script>

<div class="wrapper {className}">
	<Menu class="menu" placement="center" gutter={14}>
		<div slot="control">
			{#if $session?.user?.image}
				<img class="profileButton image" src={$session.user.image} alt="profile" />
			{:else}
				<Button class="profileButton" isRounded isPaddingSame padding="sm" type="neutral">
					<Icon class="profileIcon" icon="solar:user-bold" />
				</Button>
			{/if}
		</div>
		<Menu.Item on:click={signOut}>
			<div class="button">
				<Icon class="buttonIcon" icon="solar:logout-2-linear" />
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

		:global(.profileIcon) {
			margin-top: $space-px * 2;
		}
	}

	.button {
		display: flex;

		gap: $space-md;
		align-items: center;

		:global(.buttonIcon) {
			$dimension: $space-md + $space-xs;

			margin-top: $space-px;

			height: $dimension;
			width: $dimension;

			color: var(--text-secondary);
		}
	}

	.image {
		display: block;

		border-radius: 20rem;

		cursor: pointer;

		&:hover {
			filter: brightness(0.9);
		}

		&:active {
			filter: brightness(0.8);
		}
	}
</style>
