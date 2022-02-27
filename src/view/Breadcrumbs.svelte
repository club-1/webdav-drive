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
	import {
		Breadcrumb,
		BreadcrumbItem,
	} from "carbon-components-svelte";

	export let path: string;
	let elements = [""]; // initialise elements with root
	elements = elements.concat(path.split("/").filter((val) => val != ""));

	function href(idx: number) {
		return "#" + encodeURI(elements.slice(0, idx + 1).join("/")) + "/";
	}
</script>

<Breadcrumb>
	{#each elements as element, idx}
		<BreadcrumbItem
			href={href(idx)}
			class="clickable bordered crumb"
			isCurrentPage={idx === elements.length - 1}
		>
			{element ? element : "Home"}
		</BreadcrumbItem>
	{/each}
</Breadcrumb>
