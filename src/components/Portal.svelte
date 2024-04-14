<script lang="ts">
	import type { Action } from "svelte/action";

	export let target: HTMLElement | string;

	const portal: Action<HTMLElement, HTMLElement | string> = (node, target) => {
		let portalElement: HTMLElement | null = null;

		const update = (newTarget: HTMLElement | string) => {
			if (portalElement && node.parentNode === portalElement) {
				portalElement.removeChild(node);
			}

			target = newTarget;

			if (target instanceof HTMLElement) {
				portalElement = target;
			} else {
				portalElement = document.querySelector(target);
			}

			if (!portalElement) {
				throw new Error(`No element found: '${target}'. Use a valid selector or an HTMLElement.`);
			}

			portalElement.appendChild(node);
			node.hidden = false;
		};

		const destroy = () => {
			if (portalElement && node.parentNode === portalElement) {
				portalElement.removeChild(node);
			}
		};

		update(target);

		return {
			update,
			destroy,
		};
	};
</script>

<div use:portal={target} hidden>
	<slot />
</div>
