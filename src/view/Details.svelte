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
