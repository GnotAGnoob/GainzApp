<script lang="ts">
</script>

<div class="setsWrapper">
	<ol class="sets">
		<slot />
	</ol>
</div>

<style lang="scss">
	@import "../Exercises.scss";

	.sets {
		display: grid;

		width: max-content;
		margin: auto;

		grid-auto-columns: 1fr;
		grid-auto-flow: column;

		&Wrapper {
			margin-inline: auto;
		}
	}
</style>
