<script lang="ts">
	import type { TableEvent } from "./types";
	import type { FileSystem } from "../model/FileSystem";
	import { Directory, Inode, File } from "../model/Files";
	import { fileListUpdate, fileListUpdateIncr, loading } from "../stores";
	import { files2table } from "../model/FileUtils";
	import {
		DataTable,
		Toolbar,
		ToolbarContent,
		ToolbarBatchActions,
		Button,
		Link,
		TextInput,
		Modal,
		Form,
	} from "carbon-components-svelte";
	import Add20 from "carbon-icons-svelte/lib/Add20";
	import Delete20 from "carbon-icons-svelte/lib/Delete20";

	export let fs: FileSystem;
	export let onFileClick: (f: File) => any;
	export let path = "/";

	let files: Inode[] = [];
	let message: string | null = null;
	let checked: Inode[] = [];
	let selectedRowIds: string[] = [];
	let newFolderModal: boolean = false;
	let newFolder: string = "";
	let deleteSelectedModal: boolean = false;

	$: listFiles(path);
	$: $fileListUpdate && listFiles(path);
	$: checked = files.filter((inode) =>
		selectedRowIds.includes(inode.basename)
	);
	$: tableData = files2table(files);

	function listFiles(path: string) {
		loading.set("files");
		fs.listFiles(path)
			.then((res) => {
				files = res;
				message = null;
			})
			.catch((err) => {
				files = [];
				message = err;
			})
			.finally(() => loading.set(""));
	}

	function changeDir(dir: string) {
		selectedRowIds = [];
		path = dir;
	}

	async function newDir() {
		newFolderModal = false;
		if (newFolder) {
			await fs.createDirectory(path + newFolder);
			fileListUpdateIncr();
		}
		newFolder = "";
	}

	function deleteSelected() {
		deleteSelectedModal = false;
		let deleted: Promise<any>[] = [];
		while (checked.length > 0) {
			deleted.push(fs.deleteFile(checked.pop()!.path));
		}
		selectedRowIds = [];
		Promise.allSettled(deleted).then(fileListUpdateIncr);
	}

	function onRowClick(e: TableEvent) {
		if (e.detail.header || !e.detail.cell) {
			return false;
		}
		let inode = e.detail.row!.inode as Inode;
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
		class="file-table"
		style="width: 100%"
		on:click={(e) => onRowClick(e)}
	>
		<Toolbar>
			<ToolbarBatchActions>
				<Button
					on:click={() => (deleteSelectedModal = true)}
					icon={Delete20}
					kind="danger-ghost"
				>
					Delete
				</Button>
			</ToolbarBatchActions>
			<ToolbarContent>
				<Button on:click={() => (newFolderModal = true)} icon={Add20}>
					New folder
				</Button>
			</ToolbarContent>
		</Toolbar>
		<div slot="cell" class="file-table-cell" let:cell>
			{#if cell.key === "name"}
				<span class="file-icon">
					{cell.value.getIconChar()}
				</span>
				{#if cell.value instanceof File}
					<span on:click|stopPropagation>
						<Link
							inline
							href={fs.getFileDownloadLink(cell.value.path)}
							target="_blank"
						>
							{cell.value.basename}
						</Link>
					</span>
				{:else}
					<div>
						{cell.value.basename}
					</div>
				{/if}
			{:else}
				<div>
					{cell.display ? cell.display(cell.value) : cell.value}
				</div>
			{/if}
		</div>
	</DataTable>
{:else}
	<p class="error">{message}</p>
{/if}

<Modal
	bind:open={newFolderModal}
	size="xs"
	modalHeading="Create new folder"
	primaryButtonText="Create"
	primaryButtonDisabled={!newFolder}
	secondaryButtonText="Cancel"
	on:click:button--secondary={() => (newFolderModal = false)}
	on:submit={newDir}
	on:close={() => (newFolder = "")}
>
	<p>Enter a name for the new folder.</p>
	<Form on:submit={newDir}>
		<TextInput
			labelText="Name"
			bind:value={newFolder}
			data-modal-primary-focus
		/>
	</Form>
</Modal>

<Modal
	bind:open={deleteSelectedModal}
	size="xs"
	danger
	modalHeading="Delete selected files"
	primaryButtonText="Delete"
	secondaryButtonText="Cancel"
	on:click:button--secondary={() => (deleteSelectedModal = false)}
	on:submit={deleteSelected}
>
	<p>Are you sure you want to delete {checked.length} files?</p>
</Modal>
