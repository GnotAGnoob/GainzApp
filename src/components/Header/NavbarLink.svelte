<script lang="ts">
	import { page } from "$app/stores";

	export let href: string;
	export let text: string;
	export let clientWidth: number | undefined = undefined;
	export let onClick: undefined | ((index: number) => void) = undefined;
	export let index: number | undefined = undefined;

	$: isActive = $page.url.pathname === href;

	const handleClick = () => {
		if (!onClick || index === undefined) return;

		onClick(index);
	};
</script>

<li bind:clientWidth>
	<a class="linkWrapper" {href} on:click={handleClick} {...$$restProps}>
		<span class="link" class:link_active={isActive}>{text}</span>
	</a>
</li>

<style lang="scss">
	@import "./header.scss";

	.link {
		&Wrapper {
			display: block;
		}

		@media (max-width: $bp-header) {
			position: relative;

			font-size: $text-menu-mobile;
			margin: auto;

			&_active::after {
				content: "";

				display: block;
				position: absolute;

				width: 100%;
				height: pxToRem(2);
				left: 0;
				bottom: -$space-xs;

				background-color: var(--text-primary);
			}

			&Wrapper {
				text-align: center;
				padding: $space-md $space-lg;

				&:hover {
					background-color: var(--background-color);
					color: inherit;
				}
			}
		}

		@media (min-width: $bp-header) {
			&Wrapper {
				&_active {
					color: var(--text-primary--hover);
				}
			}
		}
	}
</style>
