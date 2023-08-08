<script lang="ts">
	import { page } from "$app/stores";

	export let href: string;
	export let text: string;

	$: isActive = $page.url.pathname === href;
</script>

<li><a class="link" class:link_active={isActive} {href}>{text}</a></li>

<style lang="scss">
	@import "./header.sass";

	.link {
		display: block;

		marker: none;
		padding-block: 0.2rem;
		color: blue;

		&_active {
			@media (max-width: $bp-header) {
				font-weight: 700;
			}

			@media (min-width: $bp-header) {
				border-bottom: 0.1rem solid white;
			}
		}
	}
</style>
