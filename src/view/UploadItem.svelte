<!--
	This file is part of WebDAV-Drive.

	Copyright 2026  Nicolas Peugnet<n.peugnet@free.fr>

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
	import { createEventDispatcher } from "svelte";
	import { _ } from "svelte-i18n";
	import {
		Box,
		Button,
		ProgressBar,
		Text,
	} from "carbon-components-svelte";
	import { Close, ErrorOutline } from "carbon-icons-svelte";
	import type { Progress } from "../model/Upload";

	export let file: File;
	export let status: "edit" | "uploading" = "edit";
	export let progress: Progress | null = null;

	$: icon = status == "edit" ? Close : ErrorOutline
	$: iconDescription = status == "edit" ? $_("Remove file") : $_("Cancel upload")

	const dispatch = createEventDispatcher();

	function dispatchDelete() {
		dispatch("delete");
	}
</script>

<Box
	display="flex"
	align="center"
	justify="space-between"
	wrap="nowrap"
	padding={3}
	fill="layer-02"
	{...$$restProps}
>
	<Text lines={1}>{file.webkitRelativePath || file.name}</Text>
	{#if status == "uploading"}
		<ProgressBar
			kind="inline"
			size="sm"
			value={progress?.loaded}
			max={progress?.total}
		/>
	{/if}
	<Button
		size="small"
		kind="ghost"
		{icon}
		{iconDescription}
		on:click={dispatchDelete}
	/>
</Box>
