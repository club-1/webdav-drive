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
	import type { Listable } from "../main/Generics";

	export let object: Listable;
</script>

<table>
	{#each [...object.list()] as [key, value]}
		<tr>
			<td class="key"><code>{key}</code></td>
			<td class="value"><code>{value}</code></td>
		</tr>
	{/each}
</table>

<style>
	table {
		margin-top: 1rem;
		color: var(--cds-text-02, #525252);
		overflow-x: auto;
		display: block;
	}

	td {
		padding: 0.4rem;
		border-top: solid 1px var(--cds-ui-03, #e0e0e0);
	}

	td.value {
		word-break: break-all;
	}
</style>
