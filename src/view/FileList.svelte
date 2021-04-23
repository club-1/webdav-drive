<script lang="ts">
	import type { FileStat } from "webdav";
	import { hrsize } from "../utils";

	export let files: FileStat[];
</script>

<table>
	<tr>
		<th scope="col">Name</th>
		<th scope="col">Size</th>
	</tr>
	{#each files as file}
		<tr>
			<td>{file.filename}</td>
			<td class="size">{hrsize(file.size)}</td>
		</tr>
	{/each}
</table>

<style>
	td.size {
		text-align: right;
	}
</style>
