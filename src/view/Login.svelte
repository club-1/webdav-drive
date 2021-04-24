<script lang="ts">
	import { logged } from "../stores"
	import type { Backend } from "../model/Backend";

	export let backend: Backend;

	let username: string;
	let password: string;

	async function login(e: Event) {
		logged.set(await backend.login(username, password));
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
