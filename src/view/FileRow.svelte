<script lang="ts">
	import type { FileStat } from "webdav";
	import { hrsize } from "../utils";

	export let file: FileStat;
</script>

<tr>
	<td>{file.filename}</td>
	<td class="size">{hrsize(file.size)}</td>
</tr>

<style>
	td.size {
		text-align: right;
	}
</style>
