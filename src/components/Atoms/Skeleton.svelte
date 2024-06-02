<script lang="ts">
	export let isRound = false;
	export let delay = 1000;
</script>

<div class="skeleton" class:rounded={isRound} style={`--delay: ${delay}ms`} />

<style lang="scss">
	.skeleton {
		display: flex;

		background-color: var(--accent-neutral-200);

		border-radius: $border-md;

		min-height: $space-sm;
		height: 100%;
		width: 100%;

		animation: opacity 1s infinite alternate ease-in-out;
		animation-delay: var(--delay, 0);
	}

	.rounded {
		border-radius: 100rem;
	}

	@keyframes opacity {
		0% {
			opacity: 1;
		}

		100% {
			opacity: 0.35;
		}
	}
</style>
