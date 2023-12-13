<script>
	import Button from "$src/components/Atoms/Button/Button.svelte";
	import Tabs from "$src/components/Tabs.svelte";
	import PlannedWorkouts from "$src/components/Workouts/PlannedWorkouts.svelte";
	import WorkoutHistory from "$src/components/Workouts/WorkoutHistory.svelte";
	import { dictionary } from "$src/lib/language/dictionary";
	import { floatedCorner } from "$src/lib/stores/floatedCorner";
	import Icon from "@iconify/svelte";

	export let data;

	let activeElement = 0;

	$floatedCorner = ["addWorkout"];
</script>

<div class="wrapper">
	<section>
		<div class="tabs">
			<Tabs let:prop={onClick} bind:activeElement>
				<Button on:click={() => onClick(0)} type="link" fontSize="md" padding="none">
					<span class="icon" slot="leftIcon">
						<Icon icon="solar:dumbbell-large-outline" />
					</span>
					<span>{dictionary.PLANNED_WORKOUTS}</span>
				</Button>
				<Button on:click={() => onClick(1)} type="link" fontSize="md" padding="none">
					<span class="icon" slot="leftIcon">
						<Icon icon="solar:notes-linear" />
					</span>
					<span>{dictionary.TEMPLATES}</span>
				</Button>
			</Tabs>
		</div>
		<div class="content">
			{#if activeElement === 0}
				<div class="fullWidth">
					<PlannedWorkouts plannedWorkouts={data.plannedWorkouts} />
				</div>
			{:else if activeElement === 1}
				<!-- else if content here -->
				<section>
					switch tab between templates and planned workouts when making workout -> button make workout from
					templates option for creating workout somehow when creating create 3 scenarios -> template, planned,
					and just create workout mozna u templatu pocitat s moznosti, ze budes vyjmenovavat jen kategorie
					mozna jinak nez dropdown? mozna dropdown, kdyz selected tak do nejake pilule ale aby to bylo
					writable
				</section>
			{:else}
				tab error
			{/if}
		</div>
	</section>
	<section>
		<h2 class="title">{dictionary.WORKOUT_HISTORY}</h2>
		<div class="fullWidth content">
			<WorkoutHistory workoutHistory={data.workoutHistory} />
		</div>
	</section>
</div>

<style lang="scss">
	.wrapper {
		display: flex;

		flex-direction: column;
		gap: $space-xl;
		margin-top: $space-md;
	}

	.tabs {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.content {
		margin-top: $space-sm + $space-xs;
	}

	.fullWidth {
		margin-inline: calc(-1 * var(--site-padding));
	}

	.icon {
		font-size: $icon-xl;
	}

	.title {
		font-size: $text;
		text-align: center;
	}
</style>
