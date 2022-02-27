<script lang="ts">
	import { Modal } from "carbon-components-svelte";
	import type { Inode } from "../model/Files";
	import Properties from "./Properties.svelte";

	export let file: Inode | null = null;
</script>

<Modal
	passiveModal
	modalHeading={file ? file.basename : ""}
	open={file != null}
>
	{#if file}
		<Properties object={file} />
	{/if}
</Modal>
