<script lang="ts">
	export let path: string;
	export let callback: (path: string) => void;
	let elements = path.split("/").filter((val) => val != "");

	function onClick(idx: number) {
		let path =  "/" + elements.slice(0, idx + 1).join("/") + "/";
		callback(path);
	}
</script>

<div class="breadcrumbs">
	{#each elements as element, idx}
		{#if idx > 0}
			<span>❯</span>
		{/if}
		<p on:click={() => onClick(idx)} class="clickable bordered crumb">{element}</p>
	{/each}
</div>

<style>
	.breadcrumbs {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
	}

	p.crumb {
		margin: 5px 2px;
		padding: 4px 8px;
	}
</style>
