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
		display: flex;

		width: max-content;
		margin: auto;

		&Wrapper {
			margin-inline: auto;
		}
	}
</style>
