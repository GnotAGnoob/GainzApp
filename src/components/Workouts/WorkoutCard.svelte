<script lang="ts">
	import Button from "$components/Atoms/Button/Button.svelte";
	import EditButtons from "$components/EditButtons.svelte";
	import { MAX_SUPERSETS } from "$src/lib/constants";
	import { dictionary } from "$src/lib/language/dictionary";
	import Icon from "@iconify/svelte";
	import EditableSuperset from "./EditableSuperset.svelte";
	import Superset from "./Superset.svelte";

	export let supersets: any[] = [];
	export let title: number | string;

	let isInEditMode: boolean;
	let copiedSupersets = Object.assign([] as any[], supersets);
	$: areAllSupersetsFilled = copiedSupersets.every((superset) =>
		superset.exercises.every((exercise) => exercise.category?.length && exercise.name?.length),
	);
	$: disabledText =
		(copiedSupersets.length >= MAX_SUPERSETS && dictionary.YOU_CANNOT_CREATE_MORE_ITEMS) ||
		(!areAllSupersetsFilled && dictionary.YOU_HAVE_TO_FILL_ALL_FIELDS);

	const onAddSuperset = () => {
		copiedSupersets = [...copiedSupersets, { exercises: [{}] }];
	};

	const onCancel = () => {
		copiedSupersets = Object.assign([], supersets);
		isInEditMode = false;
	};

	const onConfirm = () => {
		isInEditMode = false;
	};

	const onDelete = () => {
		isInEditMode = false;
	};

	// todo confirm disabel
	const todo = false;
</script>

<li class="wrapper">
	<h4 class="title">{title}</h4>
	<div class="workoutWrapper">
		<div class="edit">
			<EditButtons
				buttonType="noBackground_2"
				isAbsolute={false}
				buttonPadding="sm"
				isConfirmButton={false}
				{onCancel}
				{onDelete}
				bind:isInEditMode
			/>
		</div>
		<div class="workout">
			<!-- todo superset jen kdyt 2+ exercisu -->
			<div class="supersets">
				{#if isInEditMode}
					{#each copiedSupersets as superset, index}
						<EditableSuperset exercises={superset.exercises} order={index + 1} />
					{/each}
				{:else}
					{#each supersets as superset, index}
						<Superset exercises={superset.exercises} order={index + 1} />
					{:else}
						<!-- todo better -->
						problem
					{/each}
				{/if}

				{#if isInEditMode && copiedSupersets.length}
					<div class="button">
						<Button
							type="info"
							padding="md"
							on:click={onAddSuperset}
							disabledTitle={disabledText}
							isFullSize
						>
							<!-- Solar nema normalni plus... -->
							<Icon icon="iconoir:plus" />
							<span>{dictionary.ADD_NEW_SUPERSET}</span>
						</Button>
					</div>
					<div class="buttons">
						<Button type="negative" padding="md" on:click={onCancel} isFullSize>
							<span>{dictionary.CANCEL}</span>
						</Button>
						<Button type="positive" padding="md" on:click={onConfirm} disabledTitle={todo} isFullSize>
							<span>{dictionary.CONFIRM}</span>
						</Button>
					</div>
				{/if}
			</div>
		</div>
	</div>
</li>

<style lang="scss">
	@import "./workouts.scss";

	.wrapper {
		display: flex;

		min-width: $space-xxxl;
		width: max-content;
		max-width: $space-xxxl + $space-xxl;

		justify-content: center;
		flex-direction: column;

		gap: $space-xs;
	}

	.workout {
		&Wrapper {
			position: relative;

			padding: ($space-md) $card-side-padding ($space-md + $space-sm);

			border-radius: $border-md;
			background-color: var(--accent-neutral-100);
		}
	}

	.title {
		text-align: center;

		font-weight: 900;
		color: var(--text-secondary);
	}

	.edit {
		position: absolute;
		top: $space-xs;
		right: -$space-xs;
	}

	.supersets {
		display: flex;

		flex-direction: column;

		gap: $space-sm + $space-xs;
	}

	.button {
		&s {
			display: flex;
			gap: $space-sm;
		}
	}
</style>
