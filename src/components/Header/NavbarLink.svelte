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

<li bind:clientWidth>
	<a class="link" class:link_active={isActive} {href} on:click={handleClick} {...$$restProps}>
		{text}
	</a>
</li>

<style lang="scss">
	@import "./header.scss";

	.link {
		--_hover-color: skyblue;

		display: block;

		marker: none;
		padding-block: 0.2rem;
		color: blue;

		&:hover {
			color: var(--_hover-color);
		}
	}
</style>
