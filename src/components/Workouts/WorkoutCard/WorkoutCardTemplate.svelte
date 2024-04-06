<script lang="ts">
	import EditButtons from "$components/EditButtons.svelte";
	import { dictionary } from "$src/lib/language/dictionary";

	export let title: number | string;
	export let isInEditMode: boolean;
	export let bottomPadding: "sm" | "md" = "md";
	export let onCancel: (() => void) | undefined = undefined;
	export let onDelete: (() => void) | undefined = undefined;

	// todo pri vytvareni noveho workoutu ostatni nezvetsovat mozna ten novy nedavat do scrollu?
</script>

<li class="wrapper">
	<h4 class="title">{title}</h4>
	<div class="container">
		<div class="workoutWrapper workoutWrapper_bottomPadding_{bottomPadding}">
			<div class="edit">
				<EditButtons
					buttonType="noBackground_2"
					isAbsolute={false}
					buttonPadding="sm"
					isConfirmButton={false}
					deleteConfirmationText={dictionary.ARE_YOU_SURE_YOU_WANT_TO_DETELE_WORKOUT}
					{onCancel}
					{onDelete}
					deleteTitle={dictionary.DELETE_WORKOUT}
					bind:isInEditMode
				/>
			</div>
			<div class="workout">
				<slot />
			</div>
		</div>
	</div>
</li>

<style lang="scss">
	@import "../workouts.scss";

	.wrapper {
		display: flex;

		width: $space-xxxl + $space-lg;

		justify-content: center;
		flex-direction: column;

		gap: $space-xs;

		@media (min-width: $bp-360) {
			width: $space-xxxl + $space-xl;
		}

		@media (min-width: $bp-456) {
			width: $space-xxxl + $space-xxl;
		}

		@media (min-width: $bp-1200) {
			width: $space-xxxl + $space-xxxl;
		}
	}

	.container {
		border-radius: $border-md;

		flex-grow: 1;

		background-color: var(--accent-neutral-100);

		overflow-y: hidden;
	}

	.workout {
		display: flex;

		position: relative;

		padding-inline: $card-side-padding;

		flex-direction: column;
		gap: $space-sm;
		flex-grow: 1;

		&Wrapper {
			display: flex;

			padding-bottom: $space-md;
			min-height: $space-xxl;
			height: 100%;
			max-height: $space-xxxxl;
			overflow-y: auto;
			overflow-x: hidden;

			flex-direction: column;

			&_bottomPadding {
				&_sm {
					padding-bottom: $space-sm;
				}
			}
		}
	}

	.title {
		text-align: center;

		font-weight: 900;
		color: var(--text-secondary);
	}

	.edit {
		margin-top: $space-xs;
		margin-right: -$space-xs;
		margin-left: auto;
	}
</style>
