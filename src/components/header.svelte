<script>
    import Icon from "@iconify/svelte";
	import NavbarLink from "./NavbarLink.svelte";
</script>

<header>
    <a href="/">
        <Icon icon="mdi:home" />
    </a>
    <nav>
        <ul>
            <NavbarLink href="/list" text="List" />
            <NavbarLink href="/create" text="Create" />
            <NavbarLink href="/list" text="List" />
        </ul>
    </nav>
</header>

<style>
    .test {
        display: block;
        width: 100px;
        aspect-ratio: 1/1;
        background-color: red;
    }
</style>