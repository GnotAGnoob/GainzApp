<script lang="ts">
	export let text = "";
</script>

<p class="error">* {text}</p>

<style lang="scss">
	.error {
		margin-top: $space-xs;

		color: var(--accent-negative-500);
		font-size: $text-subheading;
		font-weight: 700;
	}
</style>
