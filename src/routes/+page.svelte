<script lang="ts">
    import { Button } from '@svelteuidev/core';

    export let data;

    const x = {x:1}
</script>


<h1>Welcome to SvelteKit {x.x}</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<Button>{data.test}</Button>