<script>
	import { page, navigating } from "$app/stores";
	import { getPageTitle } from "$lib/getPageTitle";
	import Header from "../components/Header/Header.svelte";
	import FloatingCorner from "$src/components/FloatingCorner.svelte";
	import { Toaster } from "svelte-french-toast";
	import "$sass/global.scss";
	import EnvironmentBanner from "$src/components/EnvironmentBanner.svelte";
	import { session } from "$src/lib/stores/session";
	import { floatedCorner } from "$src/lib/stores/floatedCorner";
	import { browser } from "$app/environment";
	import { onNavigate } from "$app/navigation";
	// import Swatch from "$src/components/Swatch.svelte";

	export let data;

	session.set(data.session);

	$: if (browser && $navigating) {
		$floatedCorner = [];
	}

	onNavigate((navigation) => {
		// @ts-ignore
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			// @ts-ignore
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<svelte:head>
	<title>{getPageTitle($page.route.id)}</title>
</svelte:head>
<!-- <Swatch /> -->

<div class="content">
	{#if import.meta.env.MODE === "development"}
		<div class="environmentBanner">
			<EnvironmentBanner type={import.meta.env.MODE === "development" ? "positive" : "info"}>
				This is a <span class="bannerText">{import.meta.env.MODE}</span> environment!
			</EnvironmentBanner>
		</div>
	{/if}

	<div class="floatingCorner">
		<FloatingCorner />
	</div>

	<Toaster containerStyle="view-transition-name: toaster;" />

	<div class="header">
		<Header />
	</div>

	<div class="container">
		<div class="wrapper">
			<main class="main">
				<slot />
			</main>

			<footer class="footer">
				<div>© 2023 Daniel Svátek</div>
				<div>v{data.version}</div>
			</footer>
		</div>
	</div>

	<div id="modal" />
</div>

<style lang="scss">
	.content {
		display: flex;

		flex-direction: column;
		flex-grow: 1;
	}
	.wrapper {
		display: flex;

		width: 100%;
		max-width: $max-width;
		height: 100%;
		padding-inline: var(--site-padding);
		margin-inline: auto;

		flex-grow: 1;
		flex-direction: column;
		justify-content: space-between;
	}

	.main {
		display: flex;
		flex-direction: column;

		flex-grow: 1;
	}

	.environmentBanner {
		view-transition-name: environment-banner;
	}

	.header {
		position: sticky;

		top: 0;
		view-transition-name: header;

		z-index: 100;
	}

	.footer {
		display: flex;

		margin-top: $space-md;
		padding-block: $space-sm $space-xs;

		justify-content: space-between;

		font-size: $text-copyright;
		color: var(--text-secondary);
	}

	.container {
		display: flex;

		width: 100%;
		max-width: 100%;

		flex-direction: column;
		flex-shrink: 0;
		flex-grow: 1;

		view-transition-name: main;
	}

	.bannerText {
		font-weight: 700;
	}

	.floatingCorner {
		view-transition-name: floating-corner;

		z-index: 100;
	}

	#modal {
		view-transition-name: modal;
	}

	@keyframes fade-in {
		from {
			opacity: 0;
		}
	}
	@keyframes fade-out {
		to {
			opacity: 0;
		}
	}

	@keyframes slide-from-right {
		from {
			transform: translateX(30px);
		}
	}

	@keyframes slide-to-left {
		to {
			transform: translateX(-30px);
		}
	}

	:root::view-transition-old(main) {
		animation: 90ms cubic-bezier(0.4, 0, 1, 1) both fade-out, 300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-left;
	}

	:root::view-transition-new(main) {
		animation: 210ms cubic-bezier(0, 0, 0.2, 1) 90ms both fade-in,
			300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-right;
	}
</style>
