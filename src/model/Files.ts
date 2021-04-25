import type { FileStat } from "webdav/web";

export abstract class Entry {
	constructor(
		public stat: FileStat,
		public checked: boolean = false,
	) { }

	isFile() {
		return this instanceof File;
	}

	isDirectory() {
		return this instanceof Directory;
	}
}

export class File extends Entry {
}

export class Directory extends Entry {
}
