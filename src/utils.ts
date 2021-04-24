import type { FileStat } from "webdav";

const SIZE_SYMBOLS = ['o', 'Kio', 'Mio', 'Gio', 'Tio'];

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
	return (i > 0 ? size.toFixed(1) : size) + ' ' + SIZE_SYMBOLS[i]
}


export function isDir(file: FileStat) { return file.type == "directory" }

export function parent(path: string) {
	return path.match(/(.*)\//)[1]
}
