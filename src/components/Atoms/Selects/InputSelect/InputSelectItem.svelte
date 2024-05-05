<script lang="ts">
	import { Combobox } from "bits-ui";
	import SelectItem from "../SelectItem.svelte";

	export let value: unknown;
	export let padding: "xs" | "sm" | "md" | "lg" | "none" | undefined = undefined;
</script>

<Combobox.Item {value} asChild let:builder>
	<SelectItem {padding} builders={[builder]}><slot /></SelectItem>
</Combobox.Item>
