<script lang="ts">
	import type { Backend } from "../model/Backend";
	import { fileEdit, fileListUpdate } from "../stores";
	import { basename } from "../utils";

	export let backend: Backend;

	let content: Promise<string>;
	fileEdit.subscribe((value: string) => {
		if (value != "") {
			content = backend.getFileContent(value);
		}
	});

	function closeFile() {
		fileEdit.set("");
	}

	function deleteFile() {
		backend.deleteFile($fileEdit);
		fileListUpdate.update((value) => value + 1);
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
