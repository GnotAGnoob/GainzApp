<script lang="ts">
	import Icon from "@iconify/svelte";
	import Button from "../Button/Button.svelte";
</script>

<Button disabledTitle="Loading options" type="neutral" isFullSize>
	<div class="icon">
		<Icon icon="eos-icons:loading" />
	</div>
</Button>

<style lang="scss">
	.icon {
		font-size: $icon-xl;
		margin-inline: auto;
	}
</style>
