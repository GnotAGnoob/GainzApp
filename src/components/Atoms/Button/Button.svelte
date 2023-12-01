<script lang="ts">
	import type { ButtonType } from "./types.ts";
	import Icon from "@iconify/svelte";

	export let isLoading = false;
	export let type: ButtonType = "info";
	export let isFullSize = false;
	export let isRounded = false;
	export let isPaddingSame = false;
	export let disabledTitle: string | false | undefined | null = undefined;
	export let padding: "xs" | "sm" | "md" | "lg" | "none" = "md";
	export let paddingSide: "xs" | "sm" | "md" | "lg" | "xl" | undefined = undefined;
	export let fontSize: "xs" | "sm" | "md" = "md";
	export let borderRadius: "none" | "sm" | "md" = "sm";
	export let className = "";
	export let title: string | undefined = undefined;
	export let buttonType: "button" | "submit" | "reset" = "button";
	export { className as class };
</script>

<button
	class="
		button button_{type}
		padding padding_{padding} {paddingSide && `paddingSide_${paddingSide}`}
		{className} borderRadius_{borderRadius} fontSize_{fontSize}
	"
	class:loading={isLoading}
	class:rounded={isRounded}
	class:fullSize={isFullSize}
	class:paddingSame={isPaddingSame}
	class:disabled={disabledTitle || isLoading}
	on:click
	disabled={!!disabledTitle || isLoading}
	title={disabledTitle || title}
	type={buttonType}
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
	@use "$variables/base/typography" as font;

	.button {
		display: flex;

		border-radius: $border-sm;

		gap: $space-sm;
		align-items: center;
		justify-content: center;

		font-size: $text;
		font-weight: 700;

		color: var(--color);
		background-color: var(--background);
		text-transform: capitalize;

		&:hover {
			background-color: var(--background-hover);
		}

		&:active {
			background-color: var(--background-active);
		}

		&_link {
			color: var(--text-primary);

			&:hover,
			&:active {
				color: var(--text-primary--hover);
			}
		}

		&_positive {
			--color: var(--accent-positive-800);
			--background: var(--accent-positive-100);
			--background-hover: var(--accent-positive-200);
			--background-active: var(--accent-positive-300);

			&NoBackground {
				--color: var(--accent-positive-600);
				--background: transparent;
				--background-hover: var(--accent-positive-50);
				--background-active: var(--accent-positive-100);
			}
		}

		&_negative {
			--color: var(--accent-negative-600);
			--background: var(--accent-negative-50);
			--background-hover: var(--accent-negative-100);
			--background-active: var(--accent-negative-200);

			&NoBackground {
				--color: var(--accent-negative-600);
				--background: transparent;
				--background-hover: var(--accent-negative-50);
				--background-active: var(--accent-negative-100);
			}
		}

		&_neutral {
			--color: var(--accent-neutral-700);
			--background: var(--accent-neutral-200);
			--background-hover: var(--accent-neutral-300);
			--background-active: var(--accent-neutral-400);
		}

		&_noBackground {
			--color: var(--accent-neutral-700);
			--background: transparent;
			--background-hover: var(--accent-neutral-100);
			--background-active: var(--accent-neutral-200);

			&_2 {
				--color: var(--accent-neutral-700);
				--background: transparent;
				--background-hover: var(--accent-neutral-200);
				--background-active: var(--accent-neutral-300);
			}
		}

		&_info {
			--color: var(--accent-info-800);
			--background: var(--accent-info-100);
			--background-hover: var(--accent-info-200);
			--background-active: var(--accent-info-300);

			&Inverse {
				--color: var(--background-color);
				--background: var(--accent-info-500);
				--background-hover: var(--accent-info-600);
				--background-active: var(--accent-info-700);
			}
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

		&_xs {
			--padding-block: #{$space-xxs};
			--padding-inline: #{$space-xs};
		}

		&_sm {
			--padding-block: #{$space-xs};
			--padding-inline: #{$space-sm};
		}

		&_lg {
			--padding-block: #{$space-md + $space-sm};
			--padding-inline: #{$space-lg};
		}

		&_none {
			padding: 0;
		}

		&Side_sm {
			--padding-inline: #{$space-sm};
		}

		&Side_md {
			--padding-inline: #{$space-md};
		}

		&Side_lg {
			--padding-inline: #{$space-lg};
		}

		&Side_xl {
			--padding-inline: #{$space-xl};
		}

		&Same {
			--dimensions: #{$space-lg};

			padding: 0;
			padding-top: $space-px;
			width: var(--dimensions);
			height: var(--dimensions);

			align-items: center;

			&.padding {
				&_xs {
					--dimensions: #{$space-md + $space-xs};
				}

				&_sm {
					--dimensions: #{$space-md + $space-sm};
				}

				&_lg {
					--dimensions: #{$space-lg + $space-sm};
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

	.fontSize {
		&_xs {
			font-size: font.$font-xxs;
		}

		&_sm {
			font-size: font.$font-xs;
		}

		&_md {
			font-size: font.$font-sm;
		}
	}
</style>
