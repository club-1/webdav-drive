<script lang="ts">
	import type { FileStat } from "webdav";

	import type { Backend } from "../model/Backend";
	import { hrsize, isDir, parent } from "../utils";

	export let backend: Backend;
	export let root: string;

	let path = root;
	let files: Promise<FileStat[]>;

	$: document.title = path;
	$: window.location.href = `#${path}`;
	$: if (path.charAt(path.length - 1) != "/") {
		files = Promise.reject("Not a directory.");
	} else if (!path.includes(root)) {
		files = Promise.reject("Permission denied.");
	} else {
		files = backend.listFiles(path);
	}

	window.addEventListener("hashchange", onHashChange);

	function onHashChange(e: HashChangeEvent) {
		let newPath = "";
		let matches = e.newURL.match(/#(.*)$/);
		if (matches != null) {
			newPath = matches[1];
		}
		path = newPath;
	}

	function changeDir(dir: string) {
		path = dir;
	}
</script>

<table>
	<tr>
		<th scope="col">Name</th>
		<th scope="col">Size</th>
	</tr>
	{#await files then files}
		{#if path != root}
			<tr class="directory" on:click={() => changeDir(parent(path))}>
				<td class="filename">..</td>
				<td />
			</tr>
		{/if}
		{#each files as file}
			<tr
				class:directory={isDir(file)}
				on:click={() => isDir(file) && changeDir(file.filename + "/")}
			>
				<td class="filename">
					{file.filename}
				</td>
				<td class="size">{hrsize(file.size)}</td>
			</tr>
		{/each}
	{:catch error}
		{error}
	{/await}
</table>

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
