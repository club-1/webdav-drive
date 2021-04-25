<script lang="ts">
	import type { FileSystem } from "./model/FileSystem";
	import FileList from "./view/FileList.svelte";
	import Login from "./view/Login.svelte";
	import Editor from "./view/Editor.svelte";
	import type { FileSystemProvider } from "./model/FileSystemProvider";
	import type { Config } from "./model/Config";

	export let provider: FileSystemProvider;
	export let config: Config;

	let fs: FileSystem;
	let logged = false;

	function setFileSystem(res: FileSystem) {
		fs = res;
		logged = true;
	}

	function logout() {
		logged = false;
	}
</script>

<svelte:head>
	<title>{config.branding.site_name}</title>
</svelte:head>

<main class="bordered">
	<h1>{config.branding.site_name}</h1>
	{#if !logged}
		<Login {provider} callback={setFileSystem} />
	{:else}
		<div class="file-list">
			<FileList {fs} root={config.root} />
		</div>
		<div class="editor">
			<Editor {fs} />
		</div>
		<button on:click={logout}>Log out</button>
	{/if}
</main>

<style>
	main {
		max-width: 900px;
		margin: 5px auto;
	}
	h1 {
		text-align: center;
	}
	div {
		overflow: auto;
	}
</style>
