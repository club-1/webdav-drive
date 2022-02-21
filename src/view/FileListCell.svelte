<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { File } from "../model/Files";
	import {
		Link,
		OverflowMenu,
		OverflowMenuItem,
	} from "carbon-components-svelte";
	import type { DataTableCell } from "carbon-components-svelte/types/DataTable/DataTable.svelte";
	import type { FileSystem } from "../model/FileSystem";

	const dispatch = createEventDispatcher();
	export let fs: FileSystem;
	export let cell: DataTableCell;
</script>

{#if cell.key === "menu"}
	<OverflowMenu flipped on:click={() => dispatch("click-menu")}>
		<OverflowMenuItem
			text="Rename"
			on:click={() => dispatch("click-rename")}
		/>
		<OverflowMenuItem
			text="Delete"
			danger
			on:click={() => dispatch("click-delete")}
		/>
	</OverflowMenu>
{:else}
	<div class="file-table-cell">
		{#if cell.key === "name"}
			<span class="file-icon">
				{cell.value.getIconChar()}
			</span>
			{#if cell.value instanceof File}
				<span on:click|stopPropagation>
					<Link
						inline
						href={fs.getFileDownloadLink(cell.value.path)}
						target="_blank"
					>
						{cell.value.basename}
					</Link>
				</span>
			{:else}
				<div>
					{cell.value.basename}
				</div>
			{/if}
		{:else}
			<div>
				{cell.display ? cell.display(cell.value) : cell.value}
			</div>
		{/if}
	</div>
{/if}
