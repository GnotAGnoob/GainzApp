<script lang="ts">
	export let text: string;
</script>

<h4 class="empty">
	{text}
</h4>

<style lang="scss">
	.empty {
		display: flex;

		margin: auto;
		padding: $space-lg $space-lg;
		height: $space-xxl;
		width: $space-xxxxl;
		max-width: 100%;
		border-radius: $border-md;

		justify-content: center;
		align-items: center;

		font-weight: 700;
		background-color: var(--accent-neutral-100);
	}
</style>
