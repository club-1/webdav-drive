<script lang="ts">
	import type { FileSystem } from "./model/FileSystem";
	import FileList from "./view/FileList.svelte";
	import Login from "./view/Login.svelte";
	import Details from "./view/Details.svelte";
	import type { FileSystemProvider } from "./model/FileSystemProvider";
	import type { Config } from "./main/Config";
	import type { File } from "./model/Files";

	export let provider: FileSystemProvider;
	export let config: Config;

	let fs: FileSystem;
	let logged = false;
	let file: File;

	function onLoginSuccess(res: FileSystem) {
		fs = res;
		logged = true;
	}

	function onFileClick(f: File) {
		file = f;
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
		<Login {provider} {onLoginSuccess} />
	{:else}
		<div class="file-list">
			<FileList {fs} {onFileClick} />
		</div>
		<div class="details">
			<Details {file} />
		</div>
		<button on:click={logout}>Log out</button>
	{/if}
</main>

<style>
	main {
		max-width: 900px;
		margin: 2% auto;
	}
	h1 {
		text-align: center;
	}
</style>
