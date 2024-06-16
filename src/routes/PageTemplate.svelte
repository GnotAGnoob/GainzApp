<script>
	import Button from "$src/components/Atoms/Button/Button.svelte";
	import Tabs from "$src/components/Tabs.svelte";
	import { dictionary } from "$src/lib/language/dictionary";
	import Icon from "@iconify/svelte";

	let activeElement = 0;
</script>

<div class="wrapper">
	<section class="planned">
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

			<div slot="content" class="content content_planned">
				{#if activeElement === 0}
					<section>
						<slot name="planned" />
					</section>
				{:else if activeElement === 1}
					<section>
						<div class="tabs">TBD: imagine that there are templates here</div>
						<slot name="template" />
						<!-- switch tab between templates and planned workouts 
								when making workout -> button make workout from
							templates option for creating workout somehow when creating create 3 scenarios -> template, planned,
							and just create workout mozna u templatu pocitat s moznosti, ze budes vyjmenovavat jen kategorie
							mozna jinak nez dropdown? mozna dropdown, kdyz selected tak do nejake pilule ale aby to bylo
							writable -->
					</section>
				{:else}
					tab error
				{/if}
			</div>
		</Tabs>
	</section>
	<section class="history">
		<h2 class="title">{dictionary.WORKOUT_HISTORY}</h2>
		<div class="content">
			<slot name="history" />
		</div>
	</section>
</div>

<style lang="scss">
	.wrapper {
		display: flex;

		flex-direction: column;
		gap: $space-lg;
		margin-top: $space-md;

		view-transition-name: xxx;

		@media (min-width: $bp-900) {
			gap: $space-lg + $space-md;
		}
	}

	.tabs {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.content {
		margin-top: $space-sm + $space-xs;
		view-transition-name: history;

		&_planned {
			view-transition-name: planned;
		}
	}

	.icon {
		font-size: $icon-xl;
	}

	.title {
		font-size: $text;
		text-align: center;
	}
</style>
