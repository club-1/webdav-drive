<script lang="ts">
	import { File } from "./model/File";
	import FileRow from "./view/FileRow.svelte";

	let files = [
		new File("file1", 342),
		new File("file2", 9),
		new File("file3", 239235925),
	];
</script>

<h2>Files</h2>

<table>
	<tr>
		<th>Name</th>
		<th>Size</th>
	</tr>
	{#each files as file}
		<FileRow {file} />
	{/each}
</table>
