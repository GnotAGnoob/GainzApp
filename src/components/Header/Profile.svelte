<script lang="ts">
	import Icon from "@iconify/svelte";
	import Button from "../Atoms/Button/Button.svelte";
	import { signOut } from "@auth/sveltekit/client";
	import { dictionary } from "$src/lib/language/dictionary";
	import { session } from "$src/lib/stores/session";
	import { Avatar, DropdownMenu } from "bits-ui";
	import Dropdown from "../Atoms/Dropdown/Dropdown.svelte";
</script>

<div class="wrapper">
	<Dropdown sideOffset={12}>
		<div class="profileButton" slot="button">
			<Avatar.Root>
				<div class="image"><Avatar.Image src={$session?.user?.image} alt="profile" /></div>
				<div class="profileIcon">
					<Avatar.Fallback>
						<Icon icon="solar:user-bold" />
					</Avatar.Fallback>
				</div>
			</Avatar.Root>
		</div>

		<DropdownMenu.Item slot="content">
			<Button padding="md" borderRadius="none" type="negativeNoBackground" isFullSize on:click={signOut}>
				<div class="buttonWrapper">
					<div class="buttonIcon">
						<Icon icon="solar:logout-2-linear" />
					</div>
					<p class="buttonText">{dictionary.SIGN_OUT}</p>
				</div>
			</Button>
		</DropdownMenu.Item>
	</Dropdown>
</div>

<style lang="scss">
	$icon-md-size: $space-lg;

	.profileButton {
		display: flex;

		width: $icon-md-size;
		height: $icon-md-size;

		border-radius: 20rem;

		justify-content: center;
		align-items: center;
		overflow: hidden;

		background-color: var(--accent-neutral-200);

		&:hover {
			background-color: var(--accent-neutral-300);
		}
	}

	.profileIcon {
		display: block;
		margin-top: $space-px;
	}

	.image {
		&:hover {
			filter: brightness(0.9);
		}

		&:active {
			filter: brightness(0.8);
		}
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
</style>
