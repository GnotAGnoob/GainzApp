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

<li class="linkWrapper" bind:clientWidth>
	<a class="link" class:link_active={isActive} {href} on:click={handleClick} {...$$restProps}>
		{text}
	</a>
</li>

<style lang="scss">
	@import "./header.scss";

	.link {
		display: block;

		font-size: $header-font-size;

		@media (max-width: $bp-header) {
			position: relative;

			width: fit-content;
			margin: auto;

			&_active::after {
				content: "";

				display: block;
				position: absolute;

				width: 100%;
				height: pxToRem(2);
				bottom: -0.4rem;

				background-color: black;
			}

			&Wrapper {
				width: 100%;
				padding: 0.8rem 2rem;

				&:hover {
					background-color: gray;
				}
			}
		}

		@media (min-width: $bp-header) {
			padding-block: 0.2rem;

			&_active {
				color: var(--text-primary--hover);
			}
		}
	}
</style>
