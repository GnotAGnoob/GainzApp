<script lang="ts">
	import { signIn, signOut } from "@auth/sveltekit/client";

	export let type: "positive" | "info" = "positive";
</script>

<h2 class="banner banner_{type}">
	<slot />
</h2>

<style lang="scss">
	.banner {
		width: 100%;
		padding: $space-sm $space-sm;

		text-align: center;
		font-size: $text;
		font-weight: 500;

		background-color: var(--accent-positive-500);

		&_info {
			background-color: var(--accent-info-500);
		}
	}
</style>
