<script lang="ts">
	import type { Backend } from "../model/Backend";
	import { edit } from "../stores";
	import { basename } from "../utils";

	export let backend: Backend;

	let file: string;
	edit.subscribe((value) => {
		file = value;
	});
	$: content = backend.getFileContent(file);
	$: console.log(content);

	function closeFile() {
		edit.set("");
	}
</script>

{#if $edit != ""}
	<h3>{basename($edit)}</h3>
	{#await content then content}
		<pre>
			{content}
		</pre>
	{:catch error}
		<p class="error">{error}</p>
	{/await}
	<button on:click={closeFile}>Close</button>
{/if}

<style>
	pre {
		overflow: auto;
	}
</style>
