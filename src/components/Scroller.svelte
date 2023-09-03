<script lang="ts">
	export let isScrollReverse = false;
</script>

<div class="contentWrapper">
	<div class="contentContainer" class:contentContainer_reverse={isScrollReverse}>
		<div class="content">
			<slot />
		</div>
	</div>
</div>

<style lang="scss">
	.content {
		padding-inline: var(--_side-padding);

		margin-inline: auto;

		&Container {
			display: flex;

			width: 100%;

			padding-bottom: $space-sm + $space-xxs;
			overflow-x: auto;
		}

		&Wrapper {
			--_side-padding: #{$space-md};

			position: relative;

			width: 100%;

			&::after,
			&::before {
				content: "";

				position: absolute;

				top: 0;
				bottom: 0;

				width: var(--_side-padding);

				background: transparent;
				background: linear-gradient(90deg, var(--background-color) 15%, transparent 100%);

				z-index: 1;
			}

			&::before {
				left: 0;
			}

			&::after {
				right: 0;
				transform: rotate(180deg);
			}
		}
	}
</style>
