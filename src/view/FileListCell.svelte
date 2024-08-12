<!--
	This file is part of WebDAV-Drive.

	Copyright 2021, 2022  Nicolas Peugnet<n.peugnet@free.fr>

	WebDAV-Drive is free software: you can redistribute it and/or modify it under
	the terms of the GNU General Public License as published by the Free Software
	Foundation, either version 3 of the License, or (at your option) any later
	version.

	WebDAV-Drive is distributed in the hope that it will be useful, but WITHOUT
	ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
	FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

	You should have received a copy of the GNU General Public License along with
	WebDAV-Drive. If not, see <https://www.gnu.org/licenses/>.
-->
<script lang="ts">
	import { locale, _ } from "svelte-i18n";
	import { File } from "../model/Files";
	import {
		Link,
		OverflowMenu,
		OverflowMenuItem,
	} from "carbon-components-svelte";
	import type { DataTableCell, DataTableRow } from "carbon-components-svelte/src/DataTable/DataTable.svelte";
	import type { FileSystem } from "../model/FileSystem";

	export let fs: FileSystem;
	export let cell: DataTableCell;
	export let row: DataTableRow;
	export let onClickMenu: (e?: Event) => void;
	export let onClickRename: (e?: Event) => void;
	export let onClickDetails: (e?: Event) => void;
	export let onClickDelete: (e?: Event) => void;
</script>

{#if cell.key === "menu"}
	<OverflowMenu
		size="sm"
		flipped
		iconDescription={$_("Menu")}
		on:click={onClickMenu}
	>
		<OverflowMenuItem
			text={$_("Rename")}
			on:click={onClickRename}
		/>
		<OverflowMenuItem
			text={$_("Details")}
			on:click={onClickDetails}
		/>
		<OverflowMenuItem
			text={$_("Delete")}
			danger
			on:click={onClickDelete}
		/>
	</OverflowMenu>
{:else}
	<div class="file-table-cell">
		{#if cell.key === "name"}
			<span class="file-icon">
				{cell.value.getIconChar()}
			</span>
			{#if cell.value instanceof File}
				<span on:click|stopPropagation on:keypress|stopPropagation role= "none">
					<Link
						inline
						href={fs.getFileDownloadLink(cell.value.path)}
						target="_blank"
					>
						{cell.value.getName()}
					</Link>
				</span>
			{:else}
				<div>
					{cell.value.getName()}
				</div>
			{/if}
		{:else}
			<div>
				{#key $locale}
					{cell.display ? cell.display(cell.value, row) : cell.value}
				{/key}
			</div>
		{/if}
	</div>
{/if}
