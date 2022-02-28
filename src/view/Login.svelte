<!--
	This file is part of WebDAV-Drive.

	Copyright 2021, 2022  Nicolas Peugnet<n.peugnet@free.fr>

	WebDAV-Drive is free software: you can redistribute it and/or modify it under
	the terms of the GNU General Public License as published by the Free Software
	Foundation, either version 3 of the License, or (at your option) any later
	version.

	WebDAV-Drive is distributed in the hope that it will be useful, but WITHOUT
	ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
	FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

	You should have received a copy of the GNU General Public License along with
	WebDAV-Drive. If not, see <https://www.gnu.org/licenses/>.
-->
<script lang="ts">
	import { _ } from "svelte-i18n";
	import {
		Button,
		Form,
		FormGroup,
		InlineNotification,
		PasswordInput,
		TextInput,
	} from "carbon-components-svelte";
	import { ArrowRight20 } from "carbon-icons-svelte";
	import type { FileSystem } from "../model/FileSystem";
	import type { FileSystemProvider } from "../model/FileSystemProvider";
	import { loading } from "../stores";

	export let provider: FileSystemProvider;
	export let onLoginSuccess: (fs: FileSystem) => unknown;

	let username: string;
	let password: string;
	let error: Error | null = null;

	async function login() {
		error = null;
		loading.set("Logging in");
		try {
			let fs = await provider.getFileSystem(username, password);
			localStorage.setItem("username", username);
			localStorage.setItem("password", password);
			onLoginSuccess(fs);
		} catch (err) {
			loading.set("");
			if (err instanceof Error) {
				error = err;
			}
		}
	}
</script>

<Form on:submit={login}>
	{#if error}
		<InlineNotification
			kind="error"
			title="{$_('Error')}: "
			subtitle={$_(error.message)}
			hideCloseButton
		/>
	{/if}
	<FormGroup>
		<TextInput
			bind:value={username}
			labelText={$_("Username")}
			type="text"
			autofocus
			required
		/>
		<PasswordInput
			bind:value={password}
			labelText={$_("Password")}
			required
		/>
	</FormGroup>
	<Button icon={ArrowRight20} type="submit">{$_("Log in")}</Button>
</Form>
