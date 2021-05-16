<script lang="ts">
	import type { FileSystem } from "../model/FileSystem";

	export let fs: FileSystem;
	export let path: string;
	export let callback: () => void;

	let form: HTMLFormElement;
	let files: FileList;

	async function submitHandler() {
		for (const file of files) {
			fs.putFileContent(path + file.name, await file.arrayBuffer())
				.then(callback)
				.catch(alert);
		}
		form.reset();
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
	<button type="submit">Upload</button>
</form>
