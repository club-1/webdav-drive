<script lang="ts">
	import type { FileSystem } from "../model/FileSystem";
	import { Directory, Entry, File } from "../model/Files";
	import { fileEdit, fileListUpdate, fileListUpdateIncr } from "../stores";
	import { hrsize, isAncestor, parent } from "../utils";
	import Breadcrumbs from "./Breadcrumbs.svelte";
	import Upload from "./Upload.svelte";

	export let fs: FileSystem;

	let path = "/";
	let files: Entry[] = [];
	let message: string | undefined = "Loading";
	let checked: Entry[] = [];

	$: document.title = path;
	$: window.location.href = `#${escape(path)}`;
	$: listFiles(path);
	$: $fileListUpdate && listFiles(path);
	$: checked = files.filter((entry) => entry.checked);

	window.addEventListener("hashchange", (e: HashChangeEvent) => {
		let newPath = "";
		let matches = e.newURL.match(/#(.*)$/);
		if (matches != null) {
			newPath = unescape(matches[1]);
		}
		if (path != newPath) path = newPath;
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

	function deleteSelected() {
		if (!confirm("Are you sure you want to delete these files?")) {
			return;
		}
		let deleted: Promise<any>[] = [];
		while (checked.length > 0) {
			deleted.push(fs.deleteFile(checked.pop()!.path));
		}
		Promise.allSettled(deleted).then(fileListUpdateIncr);
	}

	function clickOnEntry(entry: Entry) {
		if (entry instanceof Directory) {
			changeDir(entry.path + "/");
		} else {
			editFile(entry.path);
		}
	}
</script>

{#key path}
	<Breadcrumbs {path} callback={changeDir} />
{/key}
<table>
	<tr>
		<th scope="col" />
		<th scope="col" />
		<th scope="col">Name</th>
		<th scope="col">Last modified</th>
		<th scope="col">Size</th>
		<th scope="col" />
	</tr>
	{#if isAncestor("/", path)}
		<tr
			class="clickable directory"
			on:click={() => changeDir(parent(path))}
		>
			<td class="checkbox" />
			<td class="icon">🔙</td>
			<td class="name">..</td>
			<td class="lastmod" />
			<td class="size" />
			<td class="action" />
		</tr>
	{:else}
		<tr><td /><td /><td>.</td><td /><td /><td /></tr>
	{/if}
	{#if !message}
		{#each files as file}
			{#if !file.isHidden()}
				<tr
					class="clickable"
					class:directory={file instanceof Directory}
					on:click={() => clickOnEntry(file)}
				>
					<td class="checkbox">
						<input
							type="checkbox"
							bind:checked={file.checked}
							on:click|stopPropagation
						/>
					</td>
					<td class="icon">
						{file instanceof Directory ? "📁" : "📄"}
					</td>
					<td class="name">
						{file.basename}
					</td>
					<td class="lastmod">
						{file.lastmod.toLocaleString()}
					</td>
					<td class="size">
						{#if file instanceof File}
							{hrsize(file.size)}
						{/if}
					</td>
					<td class="action">
						{#if file instanceof File}
							<a
								href={fs.getFileDownloadLink(file.path)}
								target="_blank"
								on:click|stopPropagation>⬇️</a
							>
						{/if}
					</td>
				</tr>
			{/if}
		{/each}
	{/if}
</table>
{#if !message}
	<button on:click={newFile}>New file</button>
	<button on:click={newDir}>New directory</button>
	<button on:click={deleteSelected}>Delete selected</button>
	<Upload {fs} {path} callback={fileListUpdateIncr} />
{:else}
	<p class="error">{message}</p>
{/if}

<style>
	table {
		width: 100%;
		overflow-x: auto;
		display: block;
	}
	td {
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: clip;
	}
	td.name {
		width: 100%; /** To make it grow */
		max-width: 20vw;
	}
	td.lastmod {
		max-width: 30vw;
	}
	td.checkbox,
	td.icon,
	td.action {
		width: 25px;
		text-align: center;
	}
	td.size {
		text-align: right;
	}
</style>
