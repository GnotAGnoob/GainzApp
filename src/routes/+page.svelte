<script lang="ts">
	import Exercises from "../components/Exercises/Exercises.svelte";
	import { signIn, signOut } from "@auth/sveltekit/client";

	export let data;
</script>

<p>{data.session?.user?.email}</p>
<button on:click={() => signIn("google")}>Sign In with GitHub</button>
<Exercises categories={data.categories} />
