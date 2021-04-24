<script lang="ts">
	import {logged } from "./stores";
	import type { Backend } from "./model/Backend";
	import FileList from "./view/FileList.svelte";
	import Login from "./view/Login.svelte";

	export let backend: Backend;
	export let root: string;

	function logout() {
		backend.logout();
		logged.set(false);
	}
</script>

{#if !$logged}
	<Login {backend}/>
{:else}
	<h2>Files</h2>
	<FileList {backend} root={root} />
	<button on:click={logout}>Log out</button>
{/if}
