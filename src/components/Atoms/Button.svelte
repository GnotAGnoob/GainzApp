<script lang="ts">
	import Icon from "@iconify/svelte";

	export let isLoading = false;
	export let type: "info" | "positive" | "infoInverse" | "neutral" | "background" | "negative" = "info";
	export let isFullSize = false;
	export let isRounded = false;
	export let isPaddingSame = false;
	export let isDisabled = false;
	export let padding: "xs" | "sm" | "md" = "md";
	export let borderRadius: "none" | "sm" | "md" = "sm";
	export let className = "";
	export { className as class };
</script>

<button
	class="button button_{type} padding padding_{padding} {className} borderRadius_{borderRadius}"
	class:loading={isLoading}
	class:rounded={isRounded}
	class:fullSize={isFullSize}
	class:paddingSame={isPaddingSame}
	class:disabled={isDisabled || isLoading}
	on:click
	disabled={isDisabled || isLoading}
>
	{#if $$slots.leftIcon && !isLoading}
		<span class="icon">
			<slot name="leftIcon" />
		</span>
	{:else if isLoading}
		<span class="icon">
			<Icon icon="eos-icons:loading" />
		</span>
	{/if}
	<slot />
	{#if $$slots.rightIcon}
		<span class="icon">
			<slot name="rightIcon" />
		</span>
	{/if}
</button>

<style lang="scss">
	.button {
		--color: var(--accent-info-800);
		--background: var(--accent-info-100);
		--background-hover: var(--accent-info-200);
		--background-active: var(--accent-info-300);

		display: flex;

		border-radius: $border-sm;

		gap: $space-sm;
		align-items: center;
		justify-content: center;

		font-size: $text;
		font-weight: 700;

		color: var(--color);
		background-color: var(--background);

		&:hover {
			background-color: var(--background-hover);
		}

		&:active {
			background-color: var(--background-active);
		}

		&_positive {
			--color: var(--accent-positive-800);
			--background: var(--accent-positive-100);
			--background-hover: var(--accent-positive-200);
			--background-active: var(--accent-positive-300);
		}

		&_negative {
			--color: var(--accent-negative-600);
			--background: var(--accent-negative-50);
			--background-hover: var(--accent-negative-100);
			--background-active: var(--accent-negative-200);
		}

		&_neutral {
			--color: var(--accent-neutral-700);
			--background: var(--accent-neutral-200);
			--background-hover: var(--accent-neutral-300);
			--background-active: var(--accent-neutral-400);
		}

		&_background {
			--color: var(--accent-neutral-700);
			--background: var(--background-color);
			--background-hover: var(--accent-neutral-100);
			--background-active: var(--accent-neutral-200);
		}

		&_infoInverse {
			--color: var(--background-color);
			--background: var(--accent-info-500);
			--background-hover: var(--accent-info-600);
			--background-active: var(--accent-info-700);
		}
	}

	.icon {
		line-height: 0;
	}

	.rounded {
		border-radius: 20rem;
	}

	.padding {
		--padding-block: #{$space-sm + $space-xs};
		--padding-inline: #{$space-md};
		padding: var(--padding-block) var(--padding-inline);

		&_sm {
			--padding-block: #{$space-xs};
			--padding-inline: #{$space-sm};
		}

		&Same {
			--dimensions: #{$space-lg};

			padding: 0;
			padding-top: $space-px;
			width: var(--dimensions);
			height: var(--dimensions);

			align-items: center;

			&.padding {
				&_sm {
					--dimensions: #{$space-md + $space-sm};
				}
			}
		}
	}

	.borderRadius {
		&_none {
			border-radius: 0;
		}

		&_sm {
			border-radius: $border-sm;
		}

		&_md {
			border-radius: $border-md;
		}
	}

	.fullSize {
		width: 100%;
	}

	.disabled {
		--color: var(--accent-neutral-300);
		--background: var(--accent-neutral-100);
		--background-hover: var(--accent-neutral-100);
		--background-active: var(--accent-neutral-100);

		cursor: not-allowed;
	}
</style>
