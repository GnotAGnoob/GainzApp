<script lang="ts">
	import type { StylesType } from "$src/lib/types";

	export let setNumber: number;
	export let type: StylesType = "info";
</script>

<li class="set set_{type}">
	<div class="setNumberWrapper">
		<div class="setNumber">{setNumber}</div>
	</div>
	<div class="setInner">
		<div class="setBorderWrapper">
			<div class="weight"><slot name="weight" /></div>
			<div class="reps">
				<slot name="reps" />
			</div>
		</div>
	</div>
</li>

<style lang="scss">
	@import "../Exercises.scss";

	.set {
		--_border-color: #{$border-color-default};
		--_text-secondary-color: #{$text-secondary-color-default};
		--_text-color: #{$text-color-default};

		display: flex;

		gap: $space-xs;
		flex-direction: column;
		align-items: flex-end;

		color: var(--_text-color);

		&_positive {
			--_border-color: #{$border-color-best};
			--_text-secondary-color: #{$text-secondary-color-best};
			--_text-color: #{$text-color-best};
		}

		&_neutral {
			--_border-color: #{$border-color-history};
			--_text-secondary-color: #{$text-secondary-color-history};
			--_text-color: #{$text-color-history};
		}

		&_neutral_2 {
			--_border-color: #{$border-color-history-2};
			--_text-secondary-color: #{$text-secondary-color-history-2};
			--_text-color: #{$text-color-history-2};
		}

		&Inner {
			position: relative;
			display: flex;

			width: 100%;

			justify-content: center;

			.set:not(:first-child) &::before {
				content: "";
				display: block;
				position: absolute;

				top: 0;
				bottom: 0;
				left: 0;

				width: $space-px;
				height: 75%;
				margin-block: auto;

				background-color: var(--_border-color);
			}
		}

		&BorderWrapper {
			display: flex;

			align-items: flex-end;
			flex-direction: column;

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
</style>
