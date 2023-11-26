<!-- dev component for seeing all the color variables -->
<script lang="ts">
	const numbers = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

	const colors = ["accent-info", "accent-negative", "accent-positive", "accent-neutral"];
</script>

<div class="colors">
	{#each colors as color (color)}
		<div class="color">
			{#each numbers as number (number)}
				<div class="swatch" style="background: var(--{color}-{number});" />
			{/each}
		</div>
	{/each}
</div>

<style lang="scss">
	.colors {
		display: flex;
	}

	.color {
		display: flex;
		flex-direction: column;
	}

	.swatch {
		width: 100px;
		height: 50px;
	}
</style>
