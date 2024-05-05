<script lang="ts">
	import type { Builder } from "bits-ui";
	import Button from "../Button/Button.svelte";

	export let builders: Builder[];
	export let padding: "xs" | "sm" | "md" | "lg" | "none" | undefined = undefined;
</script>

<div class="button">
	<Button isFullSize type="noBackground" borderRadius="none" fontSize="inherit" {padding} {builders}>
		<slot />
	</Button>
</div>

<style lang="scss">
	.button {
		font-size: $text-subheading;

		&:not(:first-child) {
			border-top: $space-px solid var(--accent-neutral-100);
		}

		@media (min-width: $bp-760) {
			font-size: $text;
		}
	}
</style>
