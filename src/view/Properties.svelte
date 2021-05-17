<script lang="ts">
	export let object: Object;
</script>

<table>
	{#each Object.entries(object) as prop}
		<tr>
			<td><code>{prop[0]}</code></td>
			<td><code>{prop[1]}</code></td>
		</tr>
	{/each}
</table>
