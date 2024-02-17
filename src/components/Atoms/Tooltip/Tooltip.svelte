<script lang="ts">
	import { Tooltip } from "bits-ui";

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type $$Props = Tooltip.Props;

	export let openDelay = 150;
	export let closeDelay = 150;
	export let align: "start" | "center" | "end" | undefined = "center";
	export let side: "top" | "right" | "bottom" | "left" | undefined = "top";
	export let sideOffset = 6;
</script>

<div class="wrapper">
	<Tooltip.Root {openDelay} {closeDelay} {...$$restProps}>
		<Tooltip.Trigger class="trigger">
			<slot />
		</Tooltip.Trigger>
		<Tooltip.Content {sideOffset} {align} {side} collisionPadding={16}>
			<div class="content">
				<slot name="tooltip" />
			</div>
		</Tooltip.Content>
	</Tooltip.Root>
</div>

<style lang="scss">
	.wrapper {
		max-width: inherit;

		:global(.trigger) {
			display: block;

			max-width: inherit;

			font-weight: inherit;
		}
	}

	.content {
		position: relative;

		padding: $space-xs $space-md;
		border-radius: $border-sm;
		box-shadow: $box-shadow;

		font-size: $text-subheading;

		background-color: var(--background-color-toast);

		z-index: 10;
	}
</style>
