<script lang="ts">
	import Button from "$src/components/Button.svelte";
	import { dictionary } from "$src/lib/language/dictionary";
	import { signIn } from "@auth/sveltekit/client";
	import Icon from "@iconify/svelte";
	import { TextInput } from "@svelteuidev/core";
</script>

<div class="wrapper">
	<div class="form">
		<TextInput label="email" class="input">
			<Icon icon="solar:user-id-bold" slot="icon" />
		</TextInput>
		<TextInput label={dictionary.PASSWORD} class="input">
			<Icon icon="solar:lock-unlocked-bold" slot="icon" />
		</TextInput>
		<Button type="infoInverse" class="submit" on:click={() => signIn("google")}>
			{dictionary.SIGN_IN}
		</Button>
	</div>
	<span class="divider"><span class="dividerText">{dictionary.OR}</span></span>
	<div class="buttons">
		<Button type="info" on:click={() => signIn("google")}>
			<Icon icon="devicon:google" slot="leftIcon" />
			<span>{dictionary.SIGN_IN_WITH} Google</span>
		</Button>
	</div>
</div>

<style lang="scss">
	.wrapper {
		display: flex;

		height: 100%;
		gap: $space-lg;

		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.form {
		display: flex;

		gap: $space-md;

		flex-direction: column;

		:global(.input) {
			color: var(--text-secondary);

			:global(input) {
				background-color: var(--background-color);
				border-color: var(--accent-neutral-200);
			}

			:global(label) {
				color: var(--text-secondary);
				font-size: $text-subheading;
			}
		}

		:global(.submit) {
			margin-top: $space-sm;
		}
	}

	.divider {
		display: flex;

		width: 100%;
		padding-inline: $space-md;

		align-items: center;

		&::before,
		&::after {
			content: "";
			display: inline-block;

			height: $space-px;
			width: 100%;
			margin-top: $space-xs;

			background-color: var(--accent-neutral-200);
		}

		&Text {
			padding-inline: $space-md;
		}
	}

	.button {
		&s {
			display: flex;

			flex-direction: column;

			gap: $space-sm;
		}
	}
</style>
