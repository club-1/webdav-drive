<script lang="ts">
	import { Button, Tile } from "carbon-components-svelte";
	import type { File } from "../model/Files";
	import { basename } from "../utils";
	import Properties from "./Properties.svelte";

	export let file: File | null = null;

	function closeFile() {
		file = null;
	}
</script>

{#if file}
	<Tile>
		<h3>{basename(file.basename)}</h3>
		<Properties object={file} />
		<Button on:click={closeFile}>Close</Button>
	</Tile>
{/if}
