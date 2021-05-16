<script lang="ts">
	import type { FileSystem } from "../model/FileSystem";
	import type { Progress } from "../model/Upload";
	import { FileUpload } from "../model/Upload";

	export let fs: FileSystem;
	export let path: string;
	export let callback: () => void;

	let form: HTMLFormElement;
	let files: FileList | null = null;
	let uploads: FileUpload[] = [];

	async function submitHandler() {
		if (files == null) {
			return;
		}
		for (const file of files) {
			let upload = new FileUpload(file);
			uploads.push(upload);
			let content = await file.arrayBuffer();
			fs.putFileContent(path + file.name, content, (p: Progress) => {
				upload.progress = p;
				uploads = uploads;
			})
				.then(() => {
					uploads = uploads.filter((u) => u != upload);
					callback();
				})
				.catch(alert);
		}
		uploads = uploads;
		form.reset();
		files = null;
	}
</script>

<form
	bind:this={form}
	on:submit|preventDefault={submitHandler}
	class="bordered"
>
	<label>
		Upload files
		<input type="file" name="file" bind:files multiple />
	</label>
	<table>
		{#each uploads as upload}
			<tr>
				<td class="name">{upload.file.name}</td>
				<td>
					{#if upload.progress}
						<progress
							max={upload.progress.total}
							value={upload.progress.loaded}
						/>
					{:else}
						<progress />
					{/if}
				</td>
			</tr>
		{/each}
	</table>
	<button type="submit">Upload</button>
</form>

<style>
	td {
		border: none;
	}
	td.name {
		width: 100%;
	}
</style>
