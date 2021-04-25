<script lang="ts">
	import type { FileSystem } from "./model/FileSystem";
	import FileList from "./view/FileList.svelte";
	import Login from "./view/Login.svelte";
	import Editor from "./view/Editor.svelte";
	import type { FileSystemProvider } from "./model/FileSystemProvider";

	export let provider: FileSystemProvider;
	export let root: string;

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

{#if !logged}
	<Login {provider} callback={setFileSystem} />
{:else}
	<h2>Files</h2>
	<div class="file-list">
		<FileList {fs} {root} />
	</div>
	<div class="editor">
		<Editor {fs} />
	</div>
	<button on:click={logout}>Log out</button>
{/if}

<style>
	div {
		overflow: auto;
	}
</style>
