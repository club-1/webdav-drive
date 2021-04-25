<script lang="ts">
	import type { FileSystem } from "../model/FileSystem";
	import { Directory, Entry, File } from "../model/Files";
	import { fileEdit, fileListUpdate, fileListUpdateIncr } from "../stores";
	import { hrsize, parent } from "../utils";

	export let fs: FileSystem;
	export let root: string;

	let path = root;
	let files: Promise<Entry[]>;
	let checked: string[] = [];

	$: document.title = path;
	$: window.location.href = `#${path}`;
	$: if (path.charAt(path.length - 1) != "/") {
		files = Promise.reject("Not a directory.");
	} else if (!path.includes(root)) {
		files = Promise.reject("Permission denied.");
	} else {
		files = fs.listFiles(path);
	}

	fileListUpdate.subscribe(async () => {
		files = Promise.resolve(await fs.listFiles(path));
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
			let res = await fs.createFile(path + name);
			console.log(res);
			if (res) {
				fileListUpdateIncr();
			}
		}
	}

	async function newDir() {
		let name = prompt("New file name");
		if (name != null) {
			await fs.createDirectory(path + name);
			fileListUpdateIncr();
		}
	}

	function checkFile(file: Entry) {
		file.checked = !file.checked;
		checked.push(file.path);
	}

	function deleteSelected() {
		while (checked.length > 0) {
			fs.deleteFile(checked.pop()!);
		}
		fileListUpdateIncr();
	}
</script>

{#await files then files}
	<table>
		<tr>
			<th scope="col" />
			<th scope="col" />
			<th scope="col">Name</th>
			<th scope="col">Size</th>
		</tr>
		{#if path != root}
			<tr class="line directory" on:click={() => changeDir(parent(path))}>
				<td class="checkbox" />
				<td class="icon">🔙</td>
				<td class="name">..</td>
				<td class="size" />
			</tr>
		{/if}
		{#each files as file}
			<tr
				class="line"
				class:directory={file instanceof Directory}
				on:click={() => {
					if (file instanceof Directory) {
						changeDir(file.path + "/");
					} else {
						editFile(file.path);
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
				<td class="icon">{file instanceof Directory ? "📁" : "📄"}</td>
				<td class="name">
					{file.basename}
				</td>
				<td class="size">
					{#if file instanceof File}
						{hrsize(file.size)}
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
