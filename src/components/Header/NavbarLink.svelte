<script lang="ts">
	import { page } from "$app/stores";

	export let href: string;
	export let text: string;
	export let clientWidth: number | undefined = undefined;
	export let onClick: (index: number) => void;
	export let index: number;

	$: isActive = $page.url.pathname === href;

	const handleClick = () => {
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
		--_hover-color: skyblue;

		display: block;

		color: blue;

		@media (max-width: $bp-header) {
			position: relative;

			width: fit-content;
			margin: auto;

			&_active::after {
				content: "";

				display: block;
				position: absolute;

				width: 100%;
				height: 0.125rem;
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

			&:hover {
				color: var(--_hover-color);
			}

			&_active {
				color: var(--_hover-color);
			}
		}
	}
</style>
