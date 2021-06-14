<script lang="ts">
	import { afterUpdate } from "svelte";
	import type { TableEvent } from "./types";
	import type { FileSystem } from "../model/FileSystem";
	import { Directory, Inode, File } from "../model/Files";
	import { CopyTask, MoveTask, Task } from "../model/Tasks";
	import { fileListUpdate, fileListUpdateIncr, loading } from "../stores";
	import { files2table } from "../model/FileUtils";
	import { pass } from "../utils";
	import {
		DataTable,
		Toolbar,
		ToolbarContent,
		ToolbarBatchActions,
		Button,
		InlineNotification,
		Link,
		TextInput,
		Modal,
		Form,
		ToolbarMenu,
		ToolbarMenuItem,
	} from "carbon-components-svelte";
	import Add16 from "carbon-icons-svelte/lib/Add16";
	import Delete16 from "carbon-icons-svelte/lib/Delete16";
	import Copy16 from "carbon-icons-svelte/lib/Copy16";
	import Cut16 from "carbon-icons-svelte/lib/Cut16";
	import Paste16 from "carbon-icons-svelte/lib/Paste16";

	export let fs: FileSystem;
	export let onFileClick: (f: File) => unknown;
	export let path = "/";

	let files: Inode[] = [];
	let error: Error | null = null;
	let checked: Inode[] = [];
	let task: Task | null = null;
	let selectedRowIds: string[] = [];
	let newFolderModal = false;
	let newFolder = "";
	let deleteSelectedModal = false;

	$: listFiles(path);
	$: $fileListUpdate && listFiles(path);
	$: checked = files.filter((inode) =>
		selectedRowIds.includes(inode.basename)
	);
	$: tableData = files2table(files);

	function listFiles(path: string) {
		loading.set("Loading files");
		fs.listFiles(path)
			.then((res) => {
				files = res;
				error = null;
			})
			.catch((err: Error) => {
				files = [];
				error = err;
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

	function copySelected() {
		task = new CopyTask(fs, checked);
		selectedRowIds = [];
	}

	function cutSelected() {
		task = new MoveTask(fs, checked);
		selectedRowIds = [];
	}

	function applyTask(t: Task) {
		let actions = t.apply(path);
		task = null;
		actions.forEach((a) => a.catch(pass));
		Promise.allSettled(actions).then(fileListUpdateIncr);
	}

	function deleteSelected() {
		loading.set("Deleting files");
		deleteSelectedModal = false;
		let deleted: Promise<unknown>[] = [];
		while (checked.length > 0) {
			deleted.push(fs.deleteFile(checked.pop()!.path));
		}
		selectedRowIds = [];
		deleted.forEach((a) => a.catch(pass));
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

	afterUpdate(() => {
		// Make table rows keyboard navigable.
		for (const e of document.querySelectorAll(".file-table tbody tr")) {
			const row = e as HTMLTableRowElement;
			// Make row selectable via tab.
			row.setAttribute("tabindex", "0");
			// Trigger click on the second cell of the row on Enter.
			row.onkeyup = (e: KeyboardEvent) => {
				if (e.key === "Enter") {
					e.preventDefault();
					const td = (e.target as Element).children[1] as HTMLElement;
					td && td.click();
				}
			};
		}
	});
</script>

{#if !error}
	<DataTable
		batchSelection
		sortable
		bind:selectedRowIds
		{...tableData}
		size="short"
		class="file-table"
		style="width: 100%; margin-bottom: 1rem;"
		on:click={(e) => onRowClick(e)}
	>
		<Toolbar>
			<ToolbarBatchActions>
				<Button icon={Copy16} on:click={copySelected} />
				<Button icon={Cut16} on:click={cutSelected} />
				<Button
					on:click={() => (deleteSelectedModal = true)}
					icon={Delete16}
					kind="danger-ghost"
				>
					Delete
				</Button>
			</ToolbarBatchActions>
			<ToolbarContent>
				<ToolbarMenu
					icon={Paste16}
					title="Paste"
					disabled={task == null}
				>
					{#if task != null}
						<ToolbarMenuItem
							on:click={() => task && applyTask(task)}
						>
							{task.type}
							{task.files.length} files
						</ToolbarMenuItem>
					{/if}
				</ToolbarMenu>
				<Button on:click={() => (newFolderModal = true)} icon={Add16}>
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
	<InlineNotification
		kind="error"
		title="{error.name}: "
		subtitle={error.message}
		hideCloseButton
	/>
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
