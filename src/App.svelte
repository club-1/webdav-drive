<script lang="ts">
	import type { FileSystem } from "./model/FileSystem";
	import FileList from "./view/FileList.svelte";
	import Login from "./view/Login.svelte";
	import Details from "./view/Details.svelte";
	import Breadcrumbs from "./view/Breadcrumbs.svelte";
	import Upload from "./view/Upload.svelte";
	import type { FileSystemProvider } from "./model/FileSystemProvider";
	import type { Config } from "./main/Config";
	import type { File } from "./model/Files";
	import { error2kind, url2path } from "./utils";
	import {
		Column,
		Content,
		Grid,
		Header,
		HeaderGlobalAction,
		HeaderUtilities,
		InlineLoading,
		InlineNotification,
		Row,
		SideNav,
		SideNavDivider,
		SideNavItems,
		SideNavLink,
		Tile,
	} from "carbon-components-svelte";
	import Moon20 from "carbon-icons-svelte/lib/Moon20";
	import Sun20 from "carbon-icons-svelte/lib/Sun20";
	import LogoGithub16 from "carbon-icons-svelte/lib/LogoGithub16";
	import User16 from "carbon-icons-svelte/lib/User16";
	import { fileListUpdateIncr, isSmallScreen, loading } from "./stores";

	export let provider: FileSystemProvider;
	export let config: Config;

	let width = window.innerWidth;
	let isSideNavOpen = false;
	let dark: boolean = localStorage.getItem("dark") == "true" ? true : false;
	let fs: FileSystem | null = null;
	let file: File;
	let path: string = url2path(document.location.href) || "/";
	let errors: Error[] = [];

	$: document.documentElement.setAttribute("theme", dark ? "g100" : "g10");
	$: document.title = path;
	$: window.location.href = `#${escape(path)}`;
	$: isSmallScreen.set(width <= 610);
	$: console.log(width);

	let username = localStorage.getItem("username");
	let password = localStorage.getItem("password");
	let hasSession = username != null && password != null;
	if (username && password) {
		provider
			.getFileSystem(username, password)
			.then((res) => (fs = res))
			.catch(logout);
	}

	window.addEventListener("hashchange", (e: HashChangeEvent) => {
		let newPath = url2path(e.newURL);
		if (path != newPath) path = newPath;
	});

	window.addEventListener("error", (e: ErrorEvent) => {
		errors = [...errors, e.error];
		return false;
	});

	window.addEventListener(
		"unhandledrejection",
		(e: PromiseRejectionEvent) => {
			errors = [...errors, e.reason];
			return false;
		}
	);

	function onLoginSuccess(res: FileSystem) {
		fs = res;
	}

	function onFileClick(f: File) {
		file = f;
	}

	function logout(): void {
		fs = null;
		path = "/";
		hasSession = false;
		localStorage.removeItem("username");
		localStorage.removeItem("password");
	}

	function toggleTheme() {
		dark = !dark;
		localStorage.setItem("dark", dark ? "true" : "false");
	}
</script>

<svelte:window bind:innerWidth={width}/>

<svelte:head>
	<title>{config.branding.site_name}</title>
</svelte:head>

<Header
	platformName={config.branding.site_name}
	persistentHamburgerMenu
	bind:isSideNavOpen
>
	{#if $loading != ""}
		<InlineLoading description="{$isSmallScreen ? "" : $loading + "..."}" />
	{/if}
	<HeaderUtilities>
		<HeaderGlobalAction
			aria-label="Theme"
			icon={dark ? Sun20 : Moon20}
			on:click={toggleTheme}
		/>
	</HeaderUtilities>
</Header>

<SideNav bind:isOpen={isSideNavOpen}>
	<SideNavItems>
		{#if fs}
			<SideNavLink text="Log out" icon={User16} on:click={logout} />
		{:else}
			<SideNavLink text="Log in" icon={User16} />
		{/if}
		<SideNavDivider />
		<SideNavLink
			text="Help improving"
			icon={LogoGithub16}
			href="https://github.com/club-1/webdav-drive/"
		/>
	</SideNavItems>
</SideNav>

<Content style="padding: 0px 2% 2rem">
	<Grid>
		<Row>
			<Column>
				{#each errors as e}
					<InlineNotification
						kind={error2kind(e)}
						title="Uncaught {e.name}: "
						subtitle={e.message}
						timeout={15000}
						lowContrast
					/>
				{/each}
			</Column>
		</Row>
		{#if !fs}
			{#if !hasSession}
				<Row>
					<Column md={4} lg={5}>
						<Login {provider} {onLoginSuccess} />
					</Column>
				</Row>
			{/if}
		{:else}
			<Row>
				<Tile light style="min-height: auto">
					{#key path}
						<Breadcrumbs bind:path />
					{/key}
				</Tile>
			</Row>
			<Row>
				<Column lg={11}>
					<FileList {fs} {onFileClick} bind:path />
				</Column>
				<Column lg={5}>
					<Upload
						{fs}
						bind:path
						onUploadSuccess={fileListUpdateIncr}
						maxFileSize={config.max_body_size}
					/>
				</Column>
			</Row>
			<Details {file} />
		{/if}
	</Grid>
</Content>
