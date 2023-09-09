<script lang="ts">
	export let label: string;
	export let value: string;
</script>

<span class="wrapper">
	<label for="text" class="label">{label}</label>
	<div class="inputWrapper">
		<div class="icon icon_left">
			<slot />
		</div>
		<input
			id="text"
			{...$$restProps}
			class="input"
			class:input_left={$$slots.default}
			class:input_right={$$slots.rightIcon}
			bind:value
			on:click
			on:mousedown
			on:focus
			on:blur
			autocomplete="off"
		/>
		<div class="icon icon_right">
			<slot name="rightIcon" />
		</div>
	</div>
</span>

<style lang="scss">
	.input {
		width: 100%;
		height: 100%;

		padding: $space-sm $space-sm;
		border: none;

		color: var(--text-primary);
		background-color: transparent;

		&_left {
			padding-left: $space-md + $space-sm;
		}

		&_right {
			padding-right: $space-md + $space-sm;
		}

		&:focus {
			outline: none;
		}

		&Wrapper {
			display: flex;
			position: relative;

			border-bottom: $space-px solid var(--accent-neutral-200);
			margin-top: $space-xxs;

			align-items: flex-end;
			gap: $space-sm;

			color: var(--text-secondary);

			&:focus-within {
				border-color: var(--text-secondary);
			}
		}
	}

	.label {
		color: var(--text-secondary);
		font-size: $text-subheading;
		text-transform: capitalize;
	}

	.icon {
		display: flex;
		position: absolute;

		content: "";

		height: 100%;

		align-items: center;

		z-index: -1;

		&_left {
			left: $space-xs;
		}

		&_right {
			right: $space-xs;
		}
	}
</style>
