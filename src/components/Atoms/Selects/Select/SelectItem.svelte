<script lang="ts">
	import { Select } from "bits-ui";
	import SelectItem from "../SelectItem.svelte";
	import type { ButtonType } from "../../Button/types";

	export let value: unknown;
	export let padding: "xs" | "sm" | "md" | "lg" | "none" | undefined = undefined;
	export let type: ButtonType | undefined = undefined;
</script>

<Select.Item {value} asChild let:builder>
	<SelectItem {padding} builders={[builder]} {type}><slot /></SelectItem>
</Select.Item>
