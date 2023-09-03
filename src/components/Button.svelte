<script lang="ts">
	export let isLoading = false;
	export let type: "info" | "positive" | "infoInverse" | "neutral" = "info";
	export let isFullSize = false;
	export let isRounded = false;
	export let isPaddingSame = false;
	export let padding: "xs" | "sm" | "md" = "md";
	export let className = "";
	export { className as class };
</script>

<button
	class="button button_{type} padding padding_{padding} {className}"
	class:loading={isLoading}
	class:rounded={isRounded}
	class:fullSize={isFullSize}
	class:paddingSame={isPaddingSame}
	on:click
>
	<span class="icon">
		<slot name="leftIcon" />
	</span>
	<span>
		<slot />
	</span>
	<span class="icon">
		<slot name="rightIcon" />
	</span>
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
		align-items: flex-end;
		justify-content: space-between;

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

		&_neutral {
			--color: var(--accent-neutral-700);
			--background: var(--accent-neutral-200);
			--background-hover: var(--accent-neutral-300);
			--background-active: var(--accent-neutral-400);
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

		&_xs {
			--padding-block: #{$space-xs};
			--padding-inline: #{$space-sm};
		}

		&Same {
			padding: var(--padding-block);
		}
	}

	.fullSize {
		width: 100%;
	}
</style>
