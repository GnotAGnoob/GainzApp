<script lang="ts">
	import Skeleton from "$src/components/Atoms/Skeleton.svelte";
</script>

<div class="wrapper">
	{#each { length: 3 } as _}
		<div class="card">
			{#each { length: 3 } as _, index}
				<div class="superset">
					<div class="title">
						<Skeleton delay={-300 * (4 - index)} />
					</div>
					{#each { length: 4 - ((index + 1) % 3) } as _, index2}
						<div class="exercise">
							<Skeleton delay={-300 * (4 - index) + (index2 + 1) * 100} />
						</div>
					{/each}
				</div>
			{/each}
		</div>
	{/each}
</div>

<style lang="scss">
	.wrapper {
		display: flex;

		justify-content: center;

		gap: $space-md;
	}

	.card {
		display: flex;

		max-width: $space-xxxl + $space-xl;
		padding: ($space-md + $space-sm) ($space-md + $space-sm);
		border-radius: $border-md;

		flex-direction: column;
		gap: $space-md + $space-xs;
		flex: 1;

		background-color: var(--accent-neutral-100);

		@media (max-width: $bp-396) {
			&:nth-child(n + 2) {
				display: none;
			}
		}

		@media (max-width: $bp-760) {
			&:nth-child(n + 3) {
				display: none;
			}
		}
	}

	.superset {
		display: flex;

		flex-direction: column;
		gap: $space-sm;

		&:nth-child(3n + 1) {
			.title {
				width: $space-xxl + $space-md;
			}
		}

		&:nth-child(3n + 2) {
			.title {
				width: $space-xl;
			}
		}
	}

	.title {
		height: $space-sm + $space-xs;

		width: $space-xl + $space-lg;
	}

	.exercise {
		height: $space-md + $space-xs;

		&:nth-child(3n + 1) {
			width: 90%;
		}

		&:nth-child(3n + 2) {
			width: 85%;
		}
	}
</style>
