<script lang="ts">
	import type { Listable } from "../main/Generics";

	export let object: Listable;
</script>

<table class="raw">
	{#each [...object.list()] as [key, value]}
		<tr>
			<td><code>{key}</code></td>
			<td><code>{value}</code></td>
		</tr>
	{/each}
</table>
