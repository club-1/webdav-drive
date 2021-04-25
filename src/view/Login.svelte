<script lang="ts">
	import type { FileSystem } from "../model/FileSystem";
	import type { FileSystemProvider } from "../model/FileSystemProvider";

	export let provider: FileSystemProvider;
	export let callback: (fs: FileSystem) => void;

	let username: string;
	let password: string;

	async function login() {
		callback(await provider.getFileSystem(username, password));
	}
</script>

<form on:submit|preventDefault={login}>
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
