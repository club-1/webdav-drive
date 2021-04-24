<script lang="ts">
	import type { FileStat } from "webdav";
	import type { Backend } from "../model/Backend";
	import { hrsize, isDir, parent } from "../utils";

	export let backend: Backend;
	export const root = "/files";

	let path = root;
	$: files = backend.listFiles(path);

	function changeDir(dir: string) {
		path = dir;
	}
</script>

{#await files then files}
	<table>
		<tr>
			<th scope="col">Name</th>
			<th scope="col">Size</th>
		</tr>
		{#if path != root}
			<tr class="directory" on:click={() => changeDir(parent(path))}>
				<td class="filename">..</td>
				<td></td>
			</tr>
		{/if}
		{#each files as file}
			<tr
				class:directory={isDir(file)}
				on:click={() => isDir(file) && changeDir(file.filename)}
			>
				<td class="filename">
					{file.filename}
				</td>
				<td class="size">{hrsize(file.size)}</td>
			</tr>
		{/each}
	</table>
{:catch error}
	{error}
{/await}

<style>
	td.size {
		text-align: right;
	}
	tr.directory {
		cursor: pointer;
	}
	tr.directory:hover {
		background-color: blue;
	}
	tr.directory td.filename {
		text-decoration: underline;
	}
</style>
