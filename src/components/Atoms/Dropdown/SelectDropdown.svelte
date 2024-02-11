<script lang="ts">
	import Icon from "@iconify/svelte";
	import Dropdown from "./Dropdown.svelte";
	import { DropdownMenu } from "bits-ui";

	export let selected: string[] = [];
	export let options: string[] = [];

	const changeCheck = (index: number, checked: boolean) => {
		const option = options[index];
		const selectedIndex = selected.indexOf(option);

		if (checked && selectedIndex === -1) {
			selected = [...selected, option];
		} else {
			selected = selected.filter((_, i) => i !== selectedIndex);
		}
	};
</script>

<div class="wrapper">
	<Dropdown isCloseOnItemClick={false} align={"start"} sideOffset={6}>
		<div class="icon" slot="button">
			<Icon icon="solar:tuning-2-linear" />
			{#if selected.length}
				<div class="count">
					<h5 class="countText">{selected.length}</h5>
				</div>
			{/if}
		</div>

		<ul slot="content">
			{#each options as option, index (option)}
				<li>
					<DropdownMenu.CheckboxItem
						onCheckedChange={(checked) => {
							changeCheck(index, checked === true);
						}}
						checked={selected.includes(option)}
					>
						<DropdownMenu.CheckboxIndicator asChild={true} let:checked>
							<div class="checkbox" class:checkbox_checked={checked}>
								<div class="check">
									{#if checked}
										<div class="checkIcon">
											<Icon icon="iconoir:check" />
										</div>
									{/if}
								</div>
								<span class="option">{option}</span>
							</div>
						</DropdownMenu.CheckboxIndicator>
					</DropdownMenu.CheckboxItem>
				</li>
			{/each}
		</ul>
	</Dropdown>
</div>

<style lang="scss">
	.icon {
		--_icon-background: var(--background-color);
		display: flex;
		position: relative;

		padding: $space-sm;

		border-radius: $border-sm;

		justify-content: center;
		align-items: center;

		background-color: var(--_icon-background);

		&:hover {
			--_icon-background: var(--accent-neutral-100);
		}

		.wrapper [data-state="open"] & {
			--_icon-background: var(--accent-neutral-200);
		}
	}

	.count {
		display: flex;

		position: absolute;
		bottom: $space-xs + $space-xxs;
		right: $space-xs;
		padding-left: $space-px;

		justify-content: center;
		place-items: center;

		background-color: var(--_icon-background);
		color: var(--accent-neutral-400);

		&Text {
			font-size: $text-smallest;
		}
	}

	.check {
		position: relative;

		padding: $space-sm;

		&Icon {
			position: absolute;

			inset: 0;

			color: var(--accent-neutral-500);

			:global(path) {
				stroke-width: $space-px * 3;
			}
		}

		&box {
			display: flex;

			padding: ($space-sm + $space-xs);
			padding-right: $space-md;
			gap: $space-sm;

			align-items: center;

			cursor: pointer;

			&:hover {
				background-color: var(--accent-neutral-100);
			}
		}
	}

	.option {
		padding-bottom: $space-px;
	}
</style>
