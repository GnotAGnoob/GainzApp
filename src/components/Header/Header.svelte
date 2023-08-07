<script>
    import Icon from "@iconify/svelte";
    import { Burger, MediaQuery } from '@svelteuidev/core';
	import NavbarLink from "./NavbarLink.svelte";
</script>

<header>
    <a href="/">
        <Icon icon="mdi:home" />
    </a>
    <div class="burger">
        <Burger opened={false} />
        <nav>
            <ul>
                <NavbarLink href="/list" text="List" />
                <NavbarLink href="/create" text="Create" />
                <NavbarLink href="/list" text="List" />
            </ul>
        </nav>
    </div>
</header>

<style lang="scss">
    @media (min-width: $bp-960) {
        .burger {
            display:none;
        }
    }
</style>