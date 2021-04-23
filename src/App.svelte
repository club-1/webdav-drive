<script lang="ts">
	import { File } from "./model/File";
	import type { FileSystem } from "./model/FileSystem";
	import FileRow from "./view/FileRow.svelte";

	export let fs: FileSystem;
</script>

<h2>Files</h2>

<table>
	<tr>
		<th scope="col">Name</th>
		<th scope="col">Size</th>
	</tr>
	{#each fs.getFiles() as file}
		<FileRow {file} />
	{/each}
</table>
