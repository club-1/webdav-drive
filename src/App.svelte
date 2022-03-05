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
	import { getLocaleFromNavigator, locale, locales, _ } from "svelte-i18n";
	import type { FileSystem, Quota } from "./model/FileSystem";
	import FileList from "./view/FileList.svelte";
	import Login from "./view/Login.svelte";
	import Details from "./view/Details.svelte";
	import Breadcrumbs from "./view/Breadcrumbs.svelte";
	import Upload from "./view/Upload.svelte";
	import type { FileSystemProvider } from "./model/FileSystemProvider";
	import type { Config } from "./main/Config";
	import type { Inode } from "./model/Files";
	import { error2kind, hrsize, url2path } from "./utils";
	import {
		Column,
		Content,
		Grid,
		Header,
		HeaderGlobalAction,
		HeaderUtilities,
		InlineLoading,
		InlineNotification,
		ProgressBar,
		Row,
		Select,
		SelectItem,
		SideNav,
		SideNavDivider,
		SideNavItems,
		SideNavLink,
		Tile,
	} from "carbon-components-svelte";
	import { Moon20 } from "carbon-icons-svelte";
	import { Sun20 } from "carbon-icons-svelte";
	import { LogoGithub16 } from "carbon-icons-svelte";
	import { User16 } from "carbon-icons-svelte";
	import { fileListUpdateIncr, isSmallScreen, loading } from "./stores";

	export let provider: FileSystemProvider;
	export let config: Config;
	export let errors: Error[] = [];

	let width = window.innerWidth;
	let isSideNavOpen = false;
	let dark: boolean = isDark();
	let fs: FileSystem | null = null;
	let file: Inode;
	let path: string = url2path(document.location.href) || "/";
	let lang = localStorage.getItem("lang") || getLocaleFromNavigator() || "en";
	let quota: Quota | null;

	$: document.documentElement.setAttribute("theme", dark ? "g100" : "g10");
	$: document.title = path;
	$: window.location.href = `#${encodeURI(path)}`;
	$: isSmallScreen.set(width <= 610);
	$: locale.set(lang);
	$: localStorage.setItem("lang", lang);
	$: fs?.getQuota().then((a) => (quota = a)) ?? (quota = null);

	let username = localStorage.getItem("username");
	let password = localStorage.getItem("password");
	let hasSession = username != null && password != null;
	if (username && password) {
		loading.set("Logging in");
		provider
			.getFileSystem(username, password)
			.then((res) => (fs = res))
			.catch(() => {
				loading.set("");
				logout();
			});
	}

	window.addEventListener("hashchange", (e: Event) => {
		let hce = e as HashChangeEvent;
		let newPath = url2path(hce.newURL);
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

	function onFileClick(f: Inode) {
		file = f;
	}

	function logout(): void {
		fs = null;
		path = "/";
		hasSession = false;
		localStorage.removeItem("username");
		localStorage.removeItem("password");
		isSideNavOpen = false;
	}

	function isDark(): boolean {
		if (!localStorage.getItem("dark")) {
			return window.matchMedia("(prefers-color-scheme: dark)").matches;
		}
		return localStorage.getItem("dark") == "true";
	}

	function toggleTheme() {
		dark = !dark;
		localStorage.setItem("dark", dark ? "true" : "false");
	}
</script>

<svelte:window bind:innerWidth={width} />

<svelte:head>
	<title>{config.branding.site_name}</title>
</svelte:head>

<Header
	platformName={config.branding.site_name}
	persistentHamburgerMenu
	bind:isSideNavOpen
>
	{#if $loading != ""}
		<InlineLoading
			description={$isSmallScreen ? "" : $_($loading) + "..."}
		/>
	{/if}
	<HeaderUtilities>
		<HeaderGlobalAction
			aria-label="Theme"
			icon={dark ? Sun20 : Moon20}
			title={$_(dark ? "Use light theme" : "Use dark theme")}
			on:click={toggleTheme}
		/>
	</HeaderUtilities>
</Header>

<SideNav bind:isOpen={isSideNavOpen}>
	<Tile light>
		<Select labelText={$_("Language")} bind:selected={lang}>
			{#each $locales as locale}
				<SelectItem value={locale} text={locale} />
			{/each}
		</Select>
	</Tile>
	<SideNavItems>
		{#if fs}
			<SideNavLink text={$_("Log out")} icon={User16} on:click={logout} />
		{:else}
			<SideNavLink text={$_("Log in")} icon={User16} />
		{/if}
		<SideNavDivider />
		<SideNavLink
			text={$_("Help improving")}
			icon={LogoGithub16}
			href="https://github.com/club-1/webdav-drive/"
		/>
	</SideNavItems>
	{#if quota && typeof quota.available == "number"}
		<Tile light>
			<ProgressBar
				value={quota.used}
				max={quota.used + quota.available}
				labelText={$_("Storage space")}
				helperText={$_("{used} used of {total}", {
					values: {
						used: hrsize(quota.used),
						total: hrsize(quota.used + quota.available),
					},
				})}
			/>
		</Tile>
	{/if}
</SideNav>

<Content style="padding: 1rem 2% 2rem">
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
				<Tile light style="min-height: auto; padding-top: 0">
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
					<Tile>
						<Upload
							{fs}
							bind:path
							onUploadSuccess={fileListUpdateIncr}
							maxFileSize={config.max_body_size}
						/>
					</Tile>
				</Column>
			</Row>
			<Details {file} />
		{/if}
	</Grid>
</Content>
