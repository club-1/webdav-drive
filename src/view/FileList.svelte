<script lang="ts">
	import type { FileStat } from "webdav";

	import type { Backend } from "../model/Backend";
	import { fileEdit, fileListUpdate } from "../stores";
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

	fileListUpdate.subscribe(async (value) => {
		files = Promise.resolve(await backend.listFiles(path));
	});

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

	function editFile(file: string) {
		fileEdit.set(file);
	}
</script>

{#await files then files}
	<table>
		<tr>
			<th scope="col">Name</th>
			<th scope="col">Size</th>
		</tr>
		{#if path != root}
			<tr class="line directory" on:click={() => changeDir(parent(path))}>
				<td class="name">..</td>
				<td class="size" />
			</tr>
		{/if}
		{#each files as file}
			<tr
				class="line"
				class:directory={isDir(file)}
				on:click={() => {
					if (isDir(file)) {
						changeDir(file.filename + "/");
					} else {
						editFile(file.filename);
					}
				}}
			>
				<td class="name">
					{file.basename}
				</td>
				<td class="size">
					{#if !isDir(file)}
						{hrsize(file.size)}
					{/if}
				</td>
			</tr>
		{/each}
	</table>
{:catch error}
	<p class="error">{error}</p>
{/await}

<style>
	td.size {
		text-align: right;
	}
	tr.line {
		cursor: pointer;
	}
	tr.line:hover {
		background-color: blue;
	}
</style>
