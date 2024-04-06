<script lang="ts">
	import type { ModeType } from "$src/lib/types";

	export let type: ModeType = "development";
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

		&_preview {
			background-color: var(--accent-info-300);
		}

		&_master {
			background-color: var(--accent-info-800);
		}
	}
</style>
