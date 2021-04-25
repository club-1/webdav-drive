<script lang="ts">
	import type { FileSystem } from "../model/FileSystem";

	export let fs: FileSystem;
	export let callback: () => void;

	let username: string;
	let password: string;

	async function login() {
		if (await fs.login(username, password)) {
			callback();
		}
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
