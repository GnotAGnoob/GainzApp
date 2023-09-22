<script lang="ts">
	import type { StylesType } from "$src/lib/types";

	export let setNumber: number;
	export let weight: number;
	export let reps: number;
	export let type: StylesType = "info";
</script>

<li class="set set_{type}">
	<div class="setNumberWrapper">
		<div class="setNumber">{setNumber}</div>
	</div>
	<div class="setInner">
		<div class="setBorderWrapper">
			<div class="weight">{weight}kg</div>
			<div class="reps">
				<span class="times">x</span>
				<span>{reps}</span>
			</div>
		</div>
	</div>
</li>

<style lang="scss">
	@import "./Exercises.scss";

	.set {
		--_border-color: #{$border-color-default};
		--_text-secondary-color: #{$text-secondary-color-default};

		display: flex;

		gap: $space-xs;
		flex-direction: column;
		align-items: flex-end;

		&_positive {
			--_border-color: #{$border-color-best};
			--_text-secondary-color: #{$text-secondary-color-best};
		}

		&_neutral {
			--_border-color: #{$border-color-history};
			--_text-secondary-color: #{$text-secondary-color-history};
		}

		&_neutral_2 {
			--_border-color: #{$border-color-history-2};
			--_text-secondary-color: #{$text-secondary-color-history-2};
		}

		&Inner {
			display: flex;

			align-items: center;

			.set:not(:first-child) &::before {
				content: "";
				display: block;
				width: $space-px;
				height: 50%;
				background-color: var(--_border-color);
			}
		}

		&BorderWrapper {
			margin-inline: $item-side-padding;
			line-height: 1;
		}

		&Number {
			width: 100%;
			padding-bottom: $space-xxs;
			border-bottom: $space-px solid var(--_border-color);

			font-size: $text-smallest;
			font-weight: 900;

			&Wrapper {
				width: 100%;
				padding-inline: $item-side-padding;

				text-align: center;
			}
		}
	}

	.weight {
		color: var(--_text-secondary-color);
		font-size: $text-tag;
		font-weight: 500;
		text-align: right;
	}

	.times {
		color: var(--_text-secondary-color);
		font-size: $text-tag;
		font-weight: 300;
	}

	.reps {
		display: flex;

		margin-top: $space-xxs;

		gap: $space-xs;
		align-items: baseline;
		justify-content: space-between;
	}
</style>
