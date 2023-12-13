<script lang="ts">
	export let text: string;
</script>

<h4 class="empty">
	{text}
</h4>

<style lang="scss">
	.empty {
		margin: $space-md auto $space-sm;
		padding: $space-lg $space-lg;
		border-radius: $border-sm;

		justify-content: center;

		font-weight: 700;
		background-color: var(--accent-neutral-100);
	}
</style>
