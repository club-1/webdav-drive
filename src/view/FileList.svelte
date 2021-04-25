<script lang="ts">
	import type { Backend } from "../model/Backend";
	import type { File } from "../model/File";
	import { fileEdit, fileListUpdate, fileListUpdateIncr } from "../stores";
	import { hrsize, parent } from "../utils";

	export let backend: Backend;
	export let root: string;

	let path = root;
	let files: Promise<File[]>;
	let checked: string[] = [];

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

	async function newFile() {
		let name = prompt("New file name");
		if (name != null) {
			let res = await backend.createFile(path + name);
			console.log(res);
			if (res) {
				fileListUpdateIncr();
			}
		}
	}

	async function newDir() {
		let name = prompt("New file name");
		if (name != null) {
			await backend.createDirectory(path + name);
			fileListUpdateIncr();
		}
	}

	function checkFile(file: File) {
		file.checked = !file.checked;
		checked.push(file.stat.filename);
	}

	function deleteSelected() {
		while (checked.length > 0) {
			backend.deleteFile(checked.pop()!);
		}
		fileListUpdateIncr();
	}
</script>

{#await files then files}
	<table>
		<tr>
			<th scope="col" />
			<th scope="col">Name</th>
			<th scope="col">Size</th>
		</tr>
		{#if path != root}
			<tr class="line directory" on:click={() => changeDir(parent(path))}>
				<td class="checkbox" />
				<td class="name">..</td>
				<td class="size" />
			</tr>
		{/if}
		{#each files as file}
			<tr
				class="line"
				class:directory={file.isDir()}
				on:click={() => {
					if (file.isDir()) {
						changeDir(file.stat.filename + "/");
					} else {
						editFile(file.stat.filename);
					}
				}}
			>
				<td class="checkbox">
					<input
						type="checkbox"
						checked={file.checked}
						on:click|stopPropagation={() => checkFile(file)}
					/>
				</td>
				<td class="name">
					{file.stat.basename}
				</td>
				<td class="size">
					{#if !file.isDir()}
						{hrsize(file.stat.size)}
					{/if}
				</td>
			</tr>
		{/each}
	</table>
	<button on:click={newFile}>New file</button>
	<button on:click={newDir}>New directory</button>
	<button on:click={deleteSelected}>Delete selected</button>
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
