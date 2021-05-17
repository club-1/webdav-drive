<script lang="ts">
	import type { File } from "../model/Files";
	import { basename } from "../utils";
	import Properties from "./Properties.svelte";

	export let file: File | null = null;

	function closeFile() {
		file = null;
	}
</script>

{#if file}
	<div class="bordered">
		<h3>{basename(file.basename)}</h3>
		<Properties object={file} />
		<button on:click={closeFile}>Close</button>
	</div>
{/if}
