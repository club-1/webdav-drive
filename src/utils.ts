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
		path = unescape(matches[1]);
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
