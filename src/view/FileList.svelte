<script lang="ts">
	import type { FileSystem } from "../model/FileSystem";
	import { Directory, Inode, File } from "../model/Files";
	import { fileListUpdate, fileListUpdateIncr } from "../stores";
	import { files2table } from "../model/FileUtils";
	import Upload from "./Upload.svelte";
	import {
		DataTable,
		Toolbar,
		ToolbarContent,
		ToolbarBatchActions,
		Button,
		Link,
	} from "carbon-components-svelte";

	export let fs: FileSystem;
	export let onFileClick: (f: File) => any;
	export let path = "/";

	let files: Inode[] = [];
	let message: string | undefined = "Loading";
	let checked: Inode[] = [];
	let selectedRowIds: string[] = [];

	$: listFiles(path);
	$: $fileListUpdate && listFiles(path);
	$: checked = files.filter((inode) =>
		selectedRowIds.includes(inode.basename)
	);
	$: tableData = files2table(files);

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
		let n = checked.length;
		if (n == 0) {
			return alert("The selection is empty.");
		}
		if (!confirm(`Are you sure you want to delete ${n} files?`)) {
			return;
		}
		let deleted: Promise<any>[] = [];
		while (checked.length > 0) {
			deleted.push(fs.deleteFile(checked.pop()!.path));
		}
		selectedRowIds = [];
		Promise.allSettled(deleted).then(fileListUpdateIncr);
	}

	function onRowClick(e: CustomEvent, inode: Inode) {
		// @ts-ignore: this is a fix to not trigger the event on checkbox click.
		let target: HTMLElement = e.explicitOriginalTarget;
		if (
			target instanceof HTMLLabelElement ||
			target.className == "bx--table-column-checkbox"
		) {
			return false;
		}
		if (inode instanceof Directory) {
			changeDir(inode.path + "/");
		} else {
			onFileClick(inode as File);
		}
	}
</script>

{#if !message}
	<DataTable
		batchSelection
		sortable
		bind:selectedRowIds
		{...tableData}
		size="short"
		style="width: 100%"
		on:click:row={(e) => onRowClick(e, e.detail.inode)}
	>
		<Toolbar size="sm">
			<ToolbarBatchActions>
				<Button on:click={deleteSelected}>Delete</Button>
			</ToolbarBatchActions>
			<ToolbarContent>
				<Button on:click={newFile}>New file</Button>
				<Button on:click={newDir}>New directory</Button>
			</ToolbarContent>
		</Toolbar>
		<div slot="cell" let:cell>
			{#if cell.key === "name" && cell.value instanceof File}
				{cell.value.getIconChar()}
				<Link
					inline
					href={fs.getFileDownloadLink(cell.value.path)}
					target="_blank"
				>
					{cell.value.basename}
				</Link>
			{:else}
				{cell.display ? cell.display(cell.value) : cell.value}
			{/if}
		</div>
	</DataTable>
	<Upload {fs} {path} onUploadSuccess={fileListUpdateIncr} />
{:else}
	<p class="error">{message}</p>
{/if}
