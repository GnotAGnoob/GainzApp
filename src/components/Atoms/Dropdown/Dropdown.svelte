<script lang="ts">
	import { TRANSITION_CONFIG, TRANSITION_DURATION_FAST } from "$src/lib/transitions";
	import { DropdownMenu } from "bits-ui";
	import { slide } from "svelte/transition";

	export let isCloseOnItemClick = true;
	export let align: "start" | "center" | "end" | undefined = "center";
	export let side: "top" | "right" | "bottom" | "left" | undefined = "bottom";
	export let sideOffset = 6;
	export let collisionPadding = 16;
</script>

<div class="wrapper">
	<DropdownMenu.Root closeOnItemClick={isCloseOnItemClick} portal="#content">
		<DropdownMenu.Trigger>
			<slot name="button" />
		</DropdownMenu.Trigger>

		<DropdownMenu.Content
			class="dropdownMenu"
			{side}
			{sideOffset}
			{align}
			{collisionPadding}
			transition={slide}
			transitionConfig={{ ...TRANSITION_CONFIG, duration: TRANSITION_DURATION_FAST }}
		>
			<div class="container">
				<div class="contentWrapper">
					<slot name="content" />
				</div>
			</div>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</div>

<style lang="scss">
	$icon-md-size: $space-lg;

	.wrapper {
		display: flex;
	}

	:global(.dropdownMenu) {
		$border-radius: $border-md;
		--_background: var(--background-color-toast);

		color: var(--text-primary);

		z-index: 75;

		.container {
			border-radius: $border-radius;

			background-color: var(--_background);
			box-shadow: $box-shadow;
		}

		.contentWrapper {
			position: relative;

			padding: 0;
			border-radius: $border-radius;

			min-width: $space-xxl + $space-lg;

			overflow: hidden;

			background-color: var(--_background);
			z-index: 1;
		}
	}
</style>
