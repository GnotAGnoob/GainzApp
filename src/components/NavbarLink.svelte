<script lang="ts">
    import { page } from "$app/stores";

	export let href: string;
	export let text: string;

    const isActive = $page.url.pathname === href;
    console.log(isActive, $page.url.pathname, href);
</script>

<li><a class="link" href={href}>{text}</a></li>

<style lang="scss">
    .link {
        marker: none;
    }
    .active {
        color: green;
    }
</style>