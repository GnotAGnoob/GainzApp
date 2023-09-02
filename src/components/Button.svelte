<script lang="ts">
	import { Button } from "@svelteuidev/core";

	export let isLoading = false;
	export let type: "info" | "positive" | "info2" = "info";
	export let fullSize = true;
	export let className: string;
	export { className as class };

	let backgroundColor = "var(--accent-info-100)";
	let backgroundColorHover = "var(--accent-info-200)";
	let text = "var(--accent-info-800)";

	if (type === "positive") {
		backgroundColor = "var(--accent-positive-100)";
		backgroundColorHover = "var(--accent-positive-200)";
		text = "var(--accent-positive-800)";
	}

	if (type === "info2") {
		backgroundColor = "var(--accent-info-500)";
		backgroundColorHover = "var(--accent-info-600)";
		text = "var(--background-color)";
	}
</script>

<span class="buttonWrapper">
	<Button
		class="button button_{type} {className}"
		ripple
		loading={isLoading}
		variant="light"
		{fullSize}
		color={backgroundColor}
		override={{
			color: text,
			fontSize: "inherit",
			paddingBlock: "var(--padding)",
			height: "unset",

			"&:hover": {
				backgroundColor: backgroundColorHover,
			},
		}}
		on:click
	>
		<slot name="leftIcon" slot="leftIcon" />
		<slot />
		<slot name="rightIcon" slot="rightIcon" />
	</Button>
</span>

<style lang="scss">
	* {
		--padding: #{$space-md};
	}
</style>
