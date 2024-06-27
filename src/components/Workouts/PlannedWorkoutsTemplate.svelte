<script lang="ts">
	import Button from "$components/Atoms/Button/Button.svelte";
	import { dictionary } from "$src/lib/language/dictionary";
	import Icon from "@iconify/svelte";

	export let disableNewWorkoutTitle: string | false | null | undefined = undefined;
</script>

<div class="wrapper">
	<slot />
	<div class="button">
		<Button fontSize="md" type="info" paddingSide="xl" on:click disabledTitle={disableNewWorkoutTitle}>
			<Icon icon="iconoir:plus" slot="leftIcon" />
			<span>{dictionary.PLAN_NEW_WORKOUTS}</span>
		</Button>
	</div>
</div>

<style lang="scss">
	.wrapper {
		display: flex;

		flex-direction: column;

		justify-content: center;

		gap: $space-md;
	}

	.button {
		margin-inline: auto;
	}
</style>
