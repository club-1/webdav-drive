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
	import { _ } from "svelte-i18n";
	import {
		Button,
		ComboButton,
		Form,
		FormGroup,
		InlineNotification,
		MenuItem,
		Stack,
	} from "carbon-components-svelte";

	import UploadItem from "./UploadItem.svelte";
	import type { FileSystem } from "../model/FileSystem";
	import { FileUpload, uploadFiles, type FileToUpload } from "../model/Upload";
	import { Upload } from "carbon-icons-svelte";
	import { hrsize } from "../utils";

	export let fs: FileSystem;
	export let path: string;
	export let onUploadSuccess: () => void;
	export let maxFileSize = 0x100000;

	let fileUploader: HTMLInputElement;
	let dirUploader: HTMLInputElement;
	let files: FileList | undefined;
	let toUpload: FileToUpload[] = [];
	let uploads: FileUpload[] = [];

	$: if (files) {
		const filesToUpload = Array.from(files).map((f) =>
			Object.assign(f, { path: f.webkitRelativePath || f.name }),
		);
		toUpload = toUpload.concat(filesToUpload);
		files = undefined;
	}
	$: empty = toUpload.length == 0;
	$: tooLargeFiles = toUpload.filter((f: File) => f.size > maxFileSize);

	async function submitHandler(e: Event) {
		e.preventDefault();
		uploads = uploads.concat(
			uploadFiles(fs, path, toUpload, () => {
				// Trigger a svelte render
				uploads = uploads;
			}),
		);
		for (const upload of uploads) {
			upload.success
				.then(onUploadSuccess)
				.finally(() => (uploads = uploads.filter((u) => u != upload)));
		}
		toUpload = [];
	}

	function removeFile(file: FileToUpload) {
		toUpload = toUpload.filter(
			(curr) => curr.path != file.path
		);
	}

	function cancelUpload(u: FileUpload) {
		u.controller.abort();
		uploads = uploads.filter(
			(curr) => curr.file.path != u.file.path
		);
	}
</script>

<Form style="margin-bottom: 1rem;">
	{#each tooLargeFiles as f (f.path)}
		<InlineNotification
			kind="warning-alt"
			title="Warning: "
			subtitle="{f.name} is {hrsize(f.size)}"
			hideCloseButton
		/>
	{/each}
	<FormGroup legendText={$_("Upload files")}>
		<ComboButton
			size="sm"
			labelText={$_("Select files")}
			iconDescription={$_("More selection options")}
			on:click={() => fileUploader.click()}
		>
			<MenuItem on:click={() => dirUploader.click()}>
				{$_("Select a folder")}
			</MenuItem>
		</ComboButton>
		<Button
			kind="secondary"
			type="submit"
			size="small"
			disabled={empty}
			on:click={submitHandler}
			icon={Upload}
		>
			{$_("Upload")}
		</Button>
		<input bind:files bind:this={fileUploader} type="file" multiple />
		<input bind:files bind:this={dirUploader} type="file" webkitdirectory />

		<div class="bx--form__helper-text">
			{$_("Max file size:")}
			{hrsize(maxFileSize)}
		</div>
	</FormGroup>
</Form>

<Stack gap={3}>
	{#each toUpload as file (file.path)}
		<UploadItem {file} on:delete={() => removeFile(file)} />
	{/each}

	{#each uploads as u (u.file.path)}
		<UploadItem file={u.file} progress={u.progress} status="uploading" on:delete={() => cancelUpload(u)} />
	{/each}
</Stack>

<style>
	input[type="file"] {
		display: none;
	}
</style>
