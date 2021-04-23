<script lang="ts">
	import type { File } from "../model/File";

	export let file: File;
</script>

<tr>
	<td>{file.name}</td>
	<td>{file.size}</td>
</tr>
