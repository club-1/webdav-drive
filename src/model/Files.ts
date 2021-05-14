export abstract class Entry {
	constructor(
		public path: string,
		public basename: string,
		public lastmod: Date,
		public etag: string | null,
		public checked: boolean = false,
	) { }

	isHidden(): boolean {
		return this.basename.startsWith(".");
	}
}

export class File extends Entry {
	constructor(
		path: string,
		basename: string,
		lastmod: Date,
		etag: string | null,
		public size: number,
		public mime: string,
		checked: boolean = false,
	) {
		super(path, basename, lastmod, etag, checked);
	}
}

export class Directory extends Entry {
}
