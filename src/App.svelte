<script lang="ts">
	import type { WebDAVClient } from "webdav";
	import FileRow from "./view/FileRow.svelte";

	export let client: WebDAVClient;
</script>

<h2>Files</h2>
{#await client.getDirectoryContents("/files") then files}
	<table>
		<tr>
			<th scope="col">Name</th>
			<th scope="col">Size</th>
		</tr>
		{#each files as file}
			<FileRow {file} />
		{/each}
	</table>
{:catch error}
	{error}
{/await}
