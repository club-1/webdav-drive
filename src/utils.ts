/*
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
*/

type Kind = "error" | "warning" | "warning-alt" | "info";

const SIZE_SYMBOLS = ["o", "Kio", "Mio", "Gio", "Tio"];

/**
 * Convert size in octet to human readable size.
 * @param size in octets.
 * @returns human readable size string.
 */
export function hrsize(size: number): string {
	let i = 0;
	while (size >= 1000 && i < SIZE_SYMBOLS.length - 1) {
		size /= 1024;
		i++;
	}
	return (i > 0 ? size.toFixed(1) : size) + " " + SIZE_SYMBOLS[i];
}


export function parent(path: string): string {
	return path.slice(0, -1).match(/(.*\/)/)![1];
}

export function isAncestor(parent: string, child: string): boolean {
	return child.startsWith(parent) && child.length > parent.length;
}

export function basename(path: string): string {
	return path.match(/[^/]+$/)![0];
}

export function ab2str(buf: ArrayBuffer): string {
	// @ts-ignore
	return String.fromCharCode.apply(null, new Uint8Array(buf));
}

export function compareStrings(a: string, b: string): 1 | 0 | -1 {
	const nameA = a.toUpperCase(); // ignore upper and lowercase
	const nameB = b.toUpperCase(); // ignore upper and lowercase
	if (nameA < nameB) {
		return -1;
	}
	if (nameA > nameB) {
		return 1;
	}
	// names must be equal
	return 0;
}

export function url2path(url: string): string {
	let path = "";
	const matches = url.match(/#(.*)$/);
	if (matches != null) {
		path = decodeURI(matches[1]);
	}
	return path;
}

export function error2kind(e: Error): Kind {
	const name = e.name.toLowerCase();
	switch (name) {
	case "error":
	case "warning":
	case "warning-alt":
	case "info":
		return name;
	default:
		return "error";
	}
}

/**
 * Simply throw an exception back to main.
 * @param e The exception to throw
 */
export function pass(e:Error): void {
	throw e;
}

// Theme Utils

export enum Theme {
	Auto,
	Light,
	Dark,
}
export const THEME_COUNT = 3;
export const THEME_KEY = "theme";

/**
 * Check if a given theme is dark, based on its value and the browser's theme.
 * @param theme the theme to check.
 */
export function isDark(theme: Theme): boolean {
	switch (theme) {
	case Theme.Dark:
		return true;
	case Theme.Light:
		return false;
	case Theme.Auto:
		return window.matchMedia("(prefers-color-scheme: dark)").matches;
	}
}

/**
 * Get current theme from LocalStorage. Clean it and save it back,
 * before returning it.
 */
export function currentTheme(): Theme {
	const themeStr = localStorage.getItem(THEME_KEY);
	let theme: Theme;
	if (themeStr == null) {
		theme = Theme.Auto;
	} else {
		const themeInt = parseInt(themeStr);
		if (isNaN(themeInt)) {
			theme = Theme.Auto;
		} else {
			theme = themeInt % THEME_COUNT;
		}
	}
	localStorage.setItem(THEME_KEY, theme.toString());
	return theme;
}
