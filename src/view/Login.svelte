<script lang="ts">
	import type { Backend } from "../model/Backend";

	export let backend: Backend;
	export let callback: () => void;

	let username: string;
	let password: string;

	async function login() {
		if (await backend.login(username, password)) {
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
