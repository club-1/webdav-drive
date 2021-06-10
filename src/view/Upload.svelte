<script lang="ts">
	import {
		Button,
		FileUploaderButton,
		Form,
		FormGroup,
		Tile,
	} from "carbon-components-svelte";

	import type { FileSystem } from "../model/FileSystem";
	import type { Progress } from "../model/Upload";
	import { FileUpload } from "../model/Upload";
	import Upload20 from "carbon-icons-svelte/lib/Upload20";

	export let fs: FileSystem;
	export let path: string;
	export let onUploadSuccess: () => void;

	let labelText = "Browse";
	let ref: HTMLInputElement;
	let uploads: FileUpload[] = [];
	let files: FileList | null = null;
	let disabled = true;

	$: disabled = files === null || files.length === 0;

	async function submitHandler() {
		if (files == null) {
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
		files = null;
		labelText = "Browse";
		ref.form!.reset();
	}
</script>

<Tile>
	<Form>
		<FormGroup legendText="Upload files">
			<FileUploaderButton
				on:change={() => (files = ref.files)}
				multiple
				bind:labelText
				bind:ref
			/>
		</FormGroup>
		<Button
			type="submit"
			bind:disabled
			on:click={submitHandler}
			icon={Upload20}
		>
			Upload
		</Button>
	</Form>
	<table class="raw">
		{#each uploads as u}
			<tr>
				<td class="name">{u.file.name}</td>
				<td>
					{#if u.progress}
						<progress
							max={u.progress.total}
							value={u.progress.loaded}
						>
							{(u.progress.loaded / u.progress.total) * 100}%
						</progress>
					{:else}
						<progress />
					{/if}
				</td>
			</tr>
		{/each}
	</table>
</Tile>
