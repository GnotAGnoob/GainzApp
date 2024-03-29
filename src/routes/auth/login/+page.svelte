<script lang="ts">
	import Button from "$src/components/Atoms/Button/Button.svelte";
	import { dictionary } from "$src/lib/language/dictionary";
	import { signIn } from "@auth/sveltekit/client";
	import Icon from "@iconify/svelte";
	import Input from "$src/components/Atoms/Input.svelte";

	let email = "";
	let password = "";

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	const onSubmit = async () => {};
</script>

<div class="wrapper">
	<div class="formWrapper">
		<div class="form">
			<Input bind:value={email} label="email">
				<Icon icon="solar:user-id-bold" />
			</Input>
			<Input bind:value={password} label={dictionary.PASSWORD}>
				<Icon icon="solar:lock-unlocked-bold" />
			</Input>
			<Button type="infoInverse" class="submit" on:click={onSubmit}>
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
</div>

<style lang="scss">
	.wrapper {
		display: flex;

		padding-block: $space-xl;

		flex-grow: 1;

		justify-content: center;
		align-items: center;
	}

	.form {
		display: flex;

		gap: $space-md;

		flex-direction: column;

		:global(.submit) {
			margin-top: $space-sm;
		}

		&Wrapper {
			display: flex;

			gap: $space-lg;

			flex-direction: column;
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

			width: 100%;

			flex-direction: column;

			gap: $space-sm;
		}
	}
</style>
