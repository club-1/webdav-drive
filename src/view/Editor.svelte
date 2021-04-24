<script lang="ts">
import type { Backend } from "../model/Backend";
import { edit } from "../stores";


	export let backend: Backend;
	
	let file: string;
	edit.subscribe(value => {
		file = value;
	})
	$: content = backend.getFileContent(file);
	$: console.log(content);

	function closeFile(e:MouseEvent) {
		edit.set("");
	}
</script>

{#if $edit != ""}
	<div class="editor">
		{#await content then content}
			<pre>
				{content}
			</pre>
		{:catch error}
			<p class="error">{error}</p>
		{/await}
		<button on:click={closeFile}>Close</button>
	</div>
{/if}
