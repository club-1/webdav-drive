<script lang="ts">
	import { logged } from "./stores";
	import type { Backend } from "./model/Backend";
	import FileList from "./view/FileList.svelte";
	import Login from "./view/Login.svelte";
	import Editor from "./view/Editor.svelte";

	export let backend: Backend;
	export let root: string;

	function logout() {
		backend.logout();
		logged.set(false);
	}
</script>

{#if !$logged}
	<Login {backend} />
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
		display: inline-block;
		overflow: auto;
		width: 49%;
		vertical-align: top;
	}
</style>
