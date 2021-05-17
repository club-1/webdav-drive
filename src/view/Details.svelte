<script lang="ts">
	import type { File } from "../model/Files";
	import { basename } from "../utils";

	export let file: File | null = null;

	function closeFile() {
		file = null;
	}
</script>

{#if file }
	<h3>{basename(file.basename)}</h3>
	<pre>{JSON.stringify(file, undefined, 4)}</pre>
	<button on:click={closeFile}>Close</button>
{/if}

<style>
	pre {
		overflow: auto;
	}
</style>
