<script lang="ts">
	import type { FileSystem } from "./model/FileSystem";
	import FileList from "./view/FileList.svelte";
	import Login from "./view/Login.svelte";
	import Details from "./view/Details.svelte";
	import Breadcrumbs from "./view/Breadcrumbs.svelte";
	import type { FileSystemProvider } from "./model/FileSystemProvider";
	import type { Config } from "./main/Config";
	import type { File } from "./model/Files";
	import {
		Button,
		Content,
		Grid,
		Header,
		HeaderGlobalAction,
		HeaderUtilities,
		Row,
		SkipToContent,
	} from "carbon-components-svelte";
	import Moon20 from "carbon-icons-svelte/lib/Moon20";
	import Sun20 from "carbon-icons-svelte/lib/Sun20";

	export let provider: FileSystemProvider;
	export let config: Config;

	let dark: boolean = localStorage.getItem("dark") == "true" ? true : false;
	let fs: FileSystem;
	let logged = false;
	let file: File;
	let path: string = "/";

	$: document.documentElement.setAttribute("theme", dark ? "g100" : "g10");
	$: document.title = path;
	$: window.location.href = `#${escape(path)}`;

	window.addEventListener("hashchange", (e: HashChangeEvent) => {
		let newPath = "";
		let matches = e.newURL.match(/#(.*)$/);
		if (matches != null) {
			newPath = unescape(matches[1]);
		}
		if (path != newPath) path = newPath;
	});

	function onLoginSuccess(res: FileSystem) {
		fs = res;
		logged = true;
	}

	function onFileClick(f: File) {
		file = f;
	}

	function logout() {
		logged = false;
	}
	function toggleTheme() {
		dark = !dark;
		localStorage.setItem("dark", dark ? "true" : "false");
	}
</script>

<svelte:head>
	<title>{config.branding.site_name}</title>
</svelte:head>

<Header platformName={config.branding.site_name}>
	<div slot="skip-to-content">
		<SkipToContent />
	</div>
	<HeaderUtilities>
		<HeaderGlobalAction
			aria-label="Theme"
			icon={dark ? Sun20 : Moon20}
			on:click={toggleTheme}
		/>
	</HeaderUtilities>
</Header>

<Content style="padding: 2%">
	<Grid>
		{#if !logged}
			<Row>
				<Login {provider} {onLoginSuccess} />
			</Row>
		{:else}
			<Row>
				{#key path}
					<Breadcrumbs bind:path />
				{/key}
			</Row>
			<Row>
				<FileList {fs} {onFileClick} bind:path />
			</Row>
			<Row>
				<Details {file} />
			</Row>
			<Row>
				<Button on:click={logout}>Log out</Button>
			</Row>
		{/if}
	</Grid>
</Content>
