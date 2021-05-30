<script lang="ts">
	import {
		Button,
		Form,
		FormGroup,
		PasswordInput,
		TextInput,
	} from "carbon-components-svelte";
	import type { FileSystem } from "../model/FileSystem";
	import type { FileSystemProvider } from "../model/FileSystemProvider";

	export let provider: FileSystemProvider;
	export let onLoginSuccess: (fs: FileSystem) => any;

	let username: string;
	let password: string;

	async function login() {
		onLoginSuccess(await provider.getFileSystem(username, password));
	}
</script>

<Form on:submit={login}>
	<FormGroup>
		<TextInput bind:value={username} labelText="Username" type="text" autofocus/>
		<PasswordInput bind:value={password} labelText="Password" />
	</FormGroup>
	<Button type="submit">Log in</Button>
</Form>
