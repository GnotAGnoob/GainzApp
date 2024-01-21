<script lang="ts">
	import Icon from "@iconify/svelte";
	import Button from "../Atoms/Button/Button.svelte";
	import { signOut } from "@auth/sveltekit/client";
	import { dictionary } from "$src/lib/language/dictionary";
	import { session } from "$src/lib/stores/session";
	import { Avatar, DropdownMenu } from "bits-ui";
</script>

<div class="wrapper">
	<DropdownMenu.Root portal="#content">
		<DropdownMenu.Trigger class="profileButton">
			<Avatar.Root>
				<Avatar.Image class="image" src={$session?.user?.image} alt="profile" />
				<Avatar.Fallback class="profileIcon">
					<Icon icon="solar:user-bold" />
				</Avatar.Fallback>
			</Avatar.Root>
			<!-- use avatar component -->
			<!-- <div class="profileIcon">
				<Icon icon="solar:user-bold" />
			</div> -->
		</DropdownMenu.Trigger>

		<DropdownMenu.Content class="dropdownMenu" side="bottom" sideOffset={12} align="center" collisionPadding={16}>
			<!-- for dark mode -->
			<!-- <DropdownMenu.CheckboxItem>
			<DropdownMenu.CheckboxIndicator let:checked />
		</DropdownMenu.CheckboxItem> -->
			<!-- <DropdownMenu.Group>
			<DropdownMenu.Item />
		</DropdownMenu.Group> -->
			<div class="container">
				<div class="contentWrapper">
					<DropdownMenu.Item>
						<Button
							padding="md"
							borderRadius="none"
							type="negativeNoBackground"
							isFullSize
							on:click={signOut}
						>
							<div class="buttonWrapper">
								<div class="buttonIcon">
									<Icon icon="solar:logout-2-linear" />
								</div>
								<p class="buttonText">{dictionary.SIGN_OUT}</p>
							</div>
						</Button>
					</DropdownMenu.Item>
				</div>
				<!-- <DropdownMenu.Arrow class="dropdownArrow" /> -->
			</div>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</div>

<style lang="scss">
	$icon-md-size: $space-lg;

	.wrapper {
		display: flex;

		:global(.profileButton) {
			width: $icon-md-size;
			height: $icon-md-size;

			border-radius: 20rem;

			overflow: hidden;

			background-color: var(--accent-neutral-200);

			&:hover {
				background-color: var(--accent-neutral-300);
			}
		}

		:global(.profileIcon) {
			display: block;
			margin-top: $space-px * 2;
		}

		:global(.image) {
			&:hover {
				filter: brightness(0.9);
			}

			&:active {
				filter: brightness(0.8);
			}
		}
	}

	:global(.dropdownMenu) {
		--_background: var(--background-color-toast);

		color: var(--text-primary);

		.container {
			border-radius: $border-sm;

			background-color: var(--_background);
			box-shadow: $box-shadow;
		}

		.contentWrapper {
			position: relative;

			padding: 0;
			border-radius: $border-sm;

			min-width: $space-xxl + $space-lg;

			overflow: hidden;

			background-color: var(--_background);
			z-index: 1;
		}

		.button {
			&Wrapper {
				display: flex;

				width: 100%;

				gap: $space-md;

				align-items: flex-start;
			}

			&Icon {
				font-size: $icon-xl;
			}
		}
	}

	:global(.dropdownArrow) {
		box-shadow: $box-shadow;
	}
</style>
