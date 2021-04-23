<script lang="ts">
	import type { File } from "../model/File";

	export let file: File;
</script>

<style>
	td.size { text-align: right; }
</style>

<tr>
	<td>{file.name}</td>
	<td class="size">{file.sizeH()}</td>
</tr>
