<!--
	This file is part of WebDAV-Drive.

	Copyright 2021, 2022  Nicolas Peugnet<n.peugnet@free.fr>

	WebDAV-Drive is free software: you can redistribute it and/or modify it under
	the terms of the GNU General Public License as published by the Free Software
	Foundation, either version 3 of the License, or (at your option) any later
	version.

	WebDAV-Drive is distributed in the hope that it will be useful, but WITHOUT
	ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
	FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

	You should have received a copy of the GNU General Public License along with
	WebDAV-Drive. If not, see <https://www.gnu.org/licenses/>.
-->
<script lang="ts">
	import { afterUpdate } from "svelte";
	import type { TableEvent } from "./types";
	import type { FileSystem } from "../model/FileSystem";
	import { Directory, Inode, File } from "../model/Files";
	import { CopyTask, MoveTask, Task } from "../model/Tasks";
	import { fileListUpdate, fileListUpdateIncr, loading } from "../stores";
	import { files2table } from "../model/FileUtils";
	import { parent, pass } from "../utils";
	import FileListCell from "./FileListCell.svelte";
	import {
		DataTable,
		Toolbar,
		ToolbarContent,
		ToolbarBatchActions,
		Button,
		InlineNotification,
		TextInput,
		Modal,
		Form,
		ToolbarMenu,
		ToolbarMenuItem,
		ComposedModal,
		ModalHeader,
		ModalBody,
		ModalFooter,
	} from "carbon-components-svelte";
	import { Add16 } from "carbon-icons-svelte";
	import { Delete16 } from "carbon-icons-svelte";
	import { Copy16 } from "carbon-icons-svelte";
	import { Cut16 } from "carbon-icons-svelte";
	import { Paste16 } from "carbon-icons-svelte";

	type Size = "short" | "medium";

	export let fs: FileSystem;
	export let onFileClick: (f: Inode) => unknown;
	export let path = "/";

	const isTactile = window.matchMedia("(pointer: coarse)").matches;
	const size: Size = isTactile ? "medium" : "short";
	let files: Inode[] = [];
	let error: Error | null = null;
	let checked: Inode[] = [];
	let task: Task | null = null;
	let selectedRowIds: string[] = [];
	let newFolderModal = false;
	let newFolder = "";
	let deleteSelectedModal = false;
	let deleteModal = false;
	let renameModal = false;
	let renameValue = "";
	let menuInode: Inode;

	$: {
		listFiles(path);
		selectedRowIds = [];
	}
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

	async function newDir() {
		newFolderModal = false;
		if (newFolder) {
			await fs.createDirectory(path + newFolder);
			fileListUpdateIncr();
		}
		newFolder = "";
	}

	async function renameFile() {
		renameModal = false;
		await fs.moveFile(menuInode.path, parent(menuInode.path) + renameValue);
		fileListUpdateIncr();
	}

	async function deleteFile() {
		deleteModal = false;
		await fs.deleteFile(menuInode.path);
		fileListUpdateIncr();
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
			path = inode.path + "/";
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
		{size}
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
		<svelte:fragment slot="cell" let:cell let:row>
			<FileListCell
				{fs}
				{cell}
				on:click-menu={() => (menuInode = row.inode)}
				on:click-rename={() => {
					renameValue = menuInode.basename;
					renameModal = true;
				}}
				on:click-details={() => onFileClick(menuInode)}
				on:click-delete={() => {
					deleteModal = true;
				}}
			/>
		</svelte:fragment>
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
	size="sm"
	modalHeading="Create new folder"
	hasForm
	primaryButtonText="Create"
	primaryButtonDisabled={!newFolder}
	secondaryButtonText="Cancel"
	on:click:button--secondary={() => (newFolderModal = false)}
	on:submit={newDir}
	on:close={() => (newFolder = "")}
>
	<p>Enter a name for the new folder.</p>
	<TextInput
		labelText="Name"
		bind:value={newFolder}
		data-modal-primary-focus
	/>
</Modal>

<Modal
	bind:open={deleteSelectedModal}
	size="xs"
	danger
	modalHeading="Delete selected files"
	primaryButtonText="Delete"
	secondaryButtonText="Cancel"
	shouldSubmitOnEnter={false}
	on:click:button--secondary={() => (deleteSelectedModal = false)}
	on:submit={deleteSelected}
>
	<p>Are you sure you want to delete {checked.length} files?</p>
</Modal>

<Modal
	bind:open={deleteModal}
	size="xs"
	danger
	modalHeading="Delete this file"
	primaryButtonText="Delete"
	secondaryButtonText="Cancel"
	shouldSubmitOnEnter={false}
	on:click:button--secondary={() => (deleteModal = false)}
	on:submit={deleteFile}
>
	<p>Are you sure you want to delete the file <code>{menuInode?.basename}</code>?</p>
</Modal>

<ComposedModal size="sm" bind:open={renameModal} on:submit={renameFile}>
	<ModalHeader title="Rename file" />
	<ModalBody hasForm>
		<Form on:submit={renameFile}>
			<TextInput
				labelText="New name"
				bind:value={renameValue}
				data-modal-primary-focus
			/>
		</Form>
	</ModalBody>
	<ModalFooter
		primaryButtonText="Rename"
		primaryButtonDisabled={!renameValue}
		secondaryButtonText="Cancel"
		on:click:button--secondary={() => {
			renameModal = false;
		}}
	/>
</ComposedModal>
