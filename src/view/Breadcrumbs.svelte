<script lang="ts">
	import {
		Breadcrumb,
		BreadcrumbItem,
	} from "carbon-components-svelte";

	export let path: string;
	let elements = [""]; // initialise elements with root
	elements = elements.concat(path.split("/").filter((val) => val != ""));

	function href(idx: number) {
		return "#" + escape(elements.slice(0, idx + 1).join("/")) + "/";
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
