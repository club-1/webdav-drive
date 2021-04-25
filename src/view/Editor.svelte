<script lang="ts">
	import type { FileSystem } from "../model/FileSystem";
	import { fileEdit, fileListUpdateIncr } from "../stores";
	import { basename } from "../utils";

	export let fs: FileSystem;

	let content: Promise<string>;
	fileEdit.subscribe((value: string) => {
		if (value != "") {
			content = fs.getFileContent(value);
		}
	});

	function closeFile() {
		fileEdit.set("");
	}

	function deleteFile() {
		if (!confirm("Are you sure you want to delete this file?")) return;
		fs.deleteFile($fileEdit);
		fileListUpdateIncr();
		closeFile();
	}
</script>

{#if $fileEdit != ""}
	<h3>{basename($fileEdit)}</h3>
	{#await content then content}
		<pre>
			{content}
		</pre>
	{:catch error}
		<p class="error">{error}</p>
	{/await}
	<button on:click={closeFile}>Close</button>
	<button on:click={deleteFile}>Delete</button>
{/if}

<style>
	pre {
		overflow: auto;
	}
</style>
