<script lang="ts">
	import type { Listable } from "../main/Generics";

	export let object: Listable;
</script>

<table>
	{#each [...object.list()] as [key, value]}
		<tr>
			<td class="key"><code>{key}</code></td>
			<td class="value"><code>{value}</code></td>
		</tr>
	{/each}
</table>

<style>
	table {
		margin-top: 1rem;
		color: var(--cds-text-02, #525252);
		overflow-x: auto;
		display: block;
	}

	td {
		padding: 0.4rem;
		border-top: solid 1px var(--cds-ui-03, #e0e0e0);
	}

	td.value {
		word-break: break-all;
	}
</style>
