<script lang="ts">
	import type { FileSystem } from "../model/FileSystem";
	import { Directory, Entry, File } from "../model/Files";
	import { fileEdit, fileListUpdate, fileListUpdateIncr } from "../stores";
	import { hrsize, isAncestor, parent } from "../utils";

	export let fs: FileSystem;
	const root = fs.getRoot();

	let path = root;
	let files: Entry[];
	let message: string | undefined = "Loading";
	let checked: string[] = [];

	$: document.title = path;
	$: window.location.href = `#${path}`;
	$: listFiles(path);
	$: $fileListUpdate && listFiles(path);

	window.addEventListener("hashchange", (e: HashChangeEvent) => {
		let newPath = "";
		let matches = e.newURL.match(/#(.*)$/);
		if (matches != null) {
			newPath = matches[1];
		}
		path = newPath;
	});

	function listFiles(path: string) {
		fs.listFiles(path)
			.then((res) => {
				files = res;
				message = undefined;
			})
			.catch((err) => (message = err));
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
		if (!confirm("Are you sure you want to delete these files?")) {
			return;
		}
		while (checked.length > 0) {
			fs.deleteFile(checked.pop()!);
		}
		fileListUpdateIncr();
	}
</script>

<table>
	<tr>
		<th scope="col" />
		<th scope="col" />
		<th scope="col">Name</th>
		<th scope="col">Size</th>
	</tr>
	{#if isAncestor(root, path)}
		<tr class="entry directory" on:click={() => changeDir(parent(path))}>
			<td class="checkbox" />
			<td class="icon">🔙</td>
			<td class="name">..</td>
			<td class="size" />
		</tr>
	{:else}
		<tr><td /><td /><td>.</td></tr>
	{/if}
	{#if !message}
		{#each files as file}
			<tr
				class="entry"
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
	{/if}
</table>
{#if !message}
	<button on:click={newFile}>New file</button>
	<button on:click={newDir}>New directory</button>
	<button on:click={deleteSelected}>Delete selected</button>
{:else}
	<p class="error">{message}</p>
{/if}

<style>
	table {
		width: 100%;
	}
	td {
		text-overflow: ellipsis;
		white-space: nowrap;
		max-width: 50px;
		overflow: clip;
	}
	td.checkbox,
	td.icon {
		width: 25px;
		text-align: center;
	}
	td.size {
		text-align: right;
	}
	tr.entry {
		cursor: pointer;
	}
	tr.entry:hover {
		color: white;
		background-color: blue;
	}
</style>
