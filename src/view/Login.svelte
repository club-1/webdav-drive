<script lang="ts">
	import {
		Button,
		Form,
		FormGroup,
		InlineNotification,
		PasswordInput,
		TextInput,
	} from "carbon-components-svelte";
	import ArrowRight20 from "carbon-icons-svelte/lib/ArrowRight20";
	import type { FileSystem } from "../model/FileSystem";
	import type { FileSystemProvider } from "../model/FileSystemProvider";

	export let provider: FileSystemProvider;
	export let onLoginSuccess: (fs: FileSystem) => any;

	let username: string;
	let password: string;
	let error: Error | null = null;

	async function login() {
		error = null;
		try {
			let fs = await provider.getFileSystem(username, password);
			localStorage.setItem("username", username);
			localStorage.setItem("password", password);
			onLoginSuccess(fs);
		} catch (err) {
			error = err;
		}
	}
</script>

<Form on:submit={login}>
	{#if error}
		<InlineNotification
			kind="error"
			title="Error: "
			subtitle={error.message}
			hideCloseButton
		/>
	{/if}
	<FormGroup>
		<TextInput
			bind:value={username}
			labelText="Username"
			type="text"
			autofocus
			required
		/>
		<PasswordInput bind:value={password} labelText="Password" required />
	</FormGroup>
	<Button icon={ArrowRight20} type="submit">Log in</Button>
</Form>
