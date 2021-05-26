<script lang="ts">
	import {
		Button,
		FileUploaderButton,
		Form,
		FormGroup,
		Grid,
		Row,
		Tile,
	} from "carbon-components-svelte";

	import type { FileSystem } from "../model/FileSystem";
	import type { Progress } from "../model/Upload";
	import { FileUpload } from "../model/Upload";

	export let fs: FileSystem;
	export let path: string;
	export let onUploadSuccess: () => void;

	let labelText="Browse";
	let ref: HTMLInputElement;
	let uploads: FileUpload[] = [];

	$: files = ref ? ref.files : null;

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
				.then(onUploadSuccess)
				.catch((err) => alert(`${err} (${upload.file.name})`))
				.finally(() => (uploads = uploads.filter((u) => u != upload)));
		}
		uploads = uploads;
		ref = ref;
		files = null;
		labelText = "Browse";
		ref.form!.reset();
	}
</script>

<Grid>
	<Row>
		<Tile>
			<Form>
				<FormGroup legendText="Upload files">
					<FileUploaderButton multiple bind:labelText bind:ref />
				</FormGroup>
				<Button type="submit" on:click={submitHandler}>Upload</Button>
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
									{(u.progress.loaded / u.progress.total) *
										100}%
								</progress>
							{:else}
								<progress />
							{/if}
						</td>
					</tr>
				{/each}
			</table>
		</Tile>
	</Row>
</Grid>
