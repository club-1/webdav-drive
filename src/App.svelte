<script lang="ts">
	import type { Backend } from "./model/Backend";
	import FileList from "./view/FileList.svelte";
	import Login from "./view/Login.svelte";
	import Editor from "./view/Editor.svelte";

	export let backend: Backend;
	export let root: string;

	let logged = false;

	function login() {
		logged = true;
	}

	function logout() {
		backend.logout();
		logged = false;
	}
</script>

{#if !logged}
	<Login {backend} callback={login} />
{:else}
	<h2>Files</h2>
	<div class="file-list">
		<FileList {backend} {root} />
	</div>
	<div class="editor">
		<Editor {backend} />
	</div>
	<button on:click={logout}>Log out</button>
{/if}

<style>
	div {
		overflow: auto;
	}
</style>
