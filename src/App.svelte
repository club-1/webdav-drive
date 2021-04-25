<script lang="ts">
	import type { FileSystem } from "./model/FileSystem";
	import FileList from "./view/FileList.svelte";
	import Login from "./view/Login.svelte";
	import Editor from "./view/Editor.svelte";

	export let fs: FileSystem;
	export let root: string;

	let logged = false;

	function login() {
		logged = true;
	}

	function logout() {
		fs.logout();
		logged = false;
	}
</script>

{#if !logged}
	<Login {fs} callback={login} />
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
