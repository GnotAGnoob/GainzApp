<script lang="ts">
	import NavbarLink from "./NavbarLink.svelte";
</script>

<nav>
	<ul class={$$props.class}>
		<NavbarLink href="/" text="Home" />
		<NavbarLink href="/create" text="Create" />
		<NavbarLink href="/list" text="List" />
	</ul>
</nav>
