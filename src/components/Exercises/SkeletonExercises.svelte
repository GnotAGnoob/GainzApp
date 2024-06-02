<script lang="ts">
	import Skeleton from "../Atoms/Skeleton.svelte";
</script>

<div class="exercises">
	{#each { length: 7 } as _, index}
		<div class="exercise">
			<div class="title"><Skeleton delay={-150 * (7 - index)} /></div>
			<div class="body">
				<Skeleton delay={-150 * (5 - index) - 75} />
			</div>
		</div>
	{/each}
</div>

<style lang="scss">
	.exercise {
		display: flex;

		max-width: $space-xxxl + $space-xxl;
		width: 100%;

		flex-direction: column;
		align-items: center;
		gap: $space-sm;

		&s {
			display: flex;

			width: 100%;

			flex-direction: column;
			align-items: center;
			gap: $space-md + $space-sm;
		}

		&:nth-child(3n + 1) {
			.title {
				width: 40%;
			}
		}

		&:nth-child(3n) {
			.title {
				width: 30%;
			}
		}
	}

	.title {
		height: $space-md + $space-xs;
		width: 35%;
	}

	.body {
		height: $space-xl + $space-md;
		width: 100%;
	}
</style>
