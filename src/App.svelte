<script lang="ts">
	import type { Backend } from "./model/Backend";
	import FileList from "./view/FileList.svelte";

	export let backend: Backend;
	let logged = false;
	let username: string;
	let password: string;

	async function login(e: Event) {
		e.preventDefault();
		logged = await backend.login(username, password);
	}
</script>

{#if !logged }
	<form on:submit={login}>
		<label>
			Username
			<input bind:value={username} type="text" />
		</label>
		<label>
			Password
			<input bind:value={password} type="password" />
		</label>
		<button type="submit">Log in</button>
	</form>
{:else}
	<h2>Files</h2>
	{#await backend.listFiles("/files") then files}
		<FileList {files} />
	{:catch error}
		{error}
	{/await}
{/if}
