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
		FileUploaderButton,
		Form,
		FormGroup,
		InlineNotification,
	} from "carbon-components-svelte";

	import type { FileSystem } from "../model/FileSystem";
	import type { Progress } from "../model/Upload";
	import { FileUpload } from "../model/Upload";
	import { Upload } from "carbon-icons-svelte";
	import { hrsize } from "../utils";

	export let fs: FileSystem;
	export let path: string;
	export let onUploadSuccess: () => void;
	export let maxFileSize = 0x100000;

	const labelEmpty = "Select files";
	let uploads: FileUpload[] = [];
	let files: File[] = [];

	$: empty = !files || files.length == 0;
	$: label = empty ? labelEmpty : "{count} files selected";
	$: tooLargeFiles = files
		? Array.from(files).filter((f: File) => f.size > maxFileSize)
		: [];

	async function submitHandler(e: Event) {
		e.preventDefault();
		if (!files) {
			return;
		}
		for (const file of files) {
			let upload = new FileUpload(file);
			uploads = [...uploads, upload];
			let content = await file.arrayBuffer();
			fs.putFileContent(path + file.name, content, (p: Progress) => {
				upload.progress = p;
				uploads = uploads;
			})
				.then(onUploadSuccess)
				.finally(() => (uploads = uploads.filter((u) => u != upload)));
		}
		files = [];
	}
</script>

<Form style="margin-bottom: 1rem;">
	{#each tooLargeFiles as f}
		<InlineNotification
			kind="warning-alt"
			title="Warning: "
			subtitle="{f.name} is {hrsize(f.size)}"
			hideCloseButton
		/>
	{/each}
	<FormGroup legendText={$_("Upload files")}>
		<FileUploaderButton
			bind:files
			multiple
			labelText={$_(label, { values: { count: files?.length } })}
		/>
		<div class="bx--form__helper-text">
			{$_("Max file size:")} {hrsize(maxFileSize)}
		</div>
	</FormGroup>
	<Button
		type="submit"
		disabled={empty}
		on:click={submitHandler}
		icon={Upload}
	>
		{$_("Upload")}
	</Button>
</Form>
<div class="uploads">
	{#each uploads as u}
		<div class="flex">
			<p class="name">{u.file.name}</p>
			{#if u.progress}
				<progress max={u.progress.total} value={u.progress.loaded}>
					{(u.progress.loaded / u.progress.total) * 100}%
				</progress>
			{:else}
				<progress />
			{/if}
		</div>
	{/each}
</div>

<style>
	.uploads {
		max-width: 100%;
		width: 500px;
	}
	.flex {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: nowrap;
		padding: 0.5rem 0;
		border-top: solid 1px var(--cds-ui-03, #e0e0e0);
	}

	.name {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
