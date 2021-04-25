import type { FileStat } from "webdav/web";

export class File {
	constructor(
		public stat: FileStat,
		public checked: boolean = false,
	) { }

	isDir() {
		return this.stat.type == "directory"
	}
}
