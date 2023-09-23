<script lang="ts">
	import InputDropdown from "../Atoms/InputDropdown.svelte";
	import EditButtons from "../EditButtons.svelte";
	import Exercise from "./Exercise.svelte";
	import { debounce } from "debounce";

	const random = {
		category: "triceps",
		name: "pulldown",
	};

	export let exercise = { ...random };

	let value = exercise.category ? `${exercise.category}${exercise.name ? ` - ${exercise.name}` : ""}` : "";
	let isInEditMode = !exercise.category?.length;

	const onClick = () => {
		isInEditMode = true;
	};

	const deb = debounce(() => {
		// todo api call
		console.log("debounce");
	}, 500);

	const onConfirm = (index: number) => {
		// todo propojit z fetchnutyma itemama
		exercise = { ...random };
		isInEditMode = false;
	};

	const onEnterPress = (event: KeyboardEvent) => {
		console.log(event);
		if (event.key === "Enter") {
			// todo najit ktery souhlasi s value
			onConfirm(0);
			return;
		}

		deb();
	};

	const onDelete = () => {};

	const onBlur = () => {
		// todo check if value is valid
	};
</script>

{#if isInEditMode}
	<div class="input">
		<InputDropdown isOnMountFocus bind:value on:keyup={onEnterPress} on:blur={onBlur} onSelect={onConfirm} />
	</div>
{:else}
	<button class="button" on:click={onClick}>
		<div class="exercise">
			<Exercise {exercise} />
		</div>
		<div class="edit">
			<EditButtons
				bind:isInEditMode
				isConfirmButton={false}
				{onDelete}
				isAbsolute={false}
				isPadding={false}
				buttonType="noBackground_2"
			/>
		</div>
	</button>
{/if}

<style lang="scss">
	@import "./workouts.scss";

	.button {
		display: flex;

		justify-content: space-between;
		align-items: center;
		gap: $space-sm;

		margin-right: -$card-side-padding + $space-sm;
	}

	.exercise {
		flex: 1;
	}

	.input {
		background-color: var(--accent-neutral-50);

		margin-top: $space-xs;
	}

	.edit {
		align-self: flex-start;
	}
</style>
