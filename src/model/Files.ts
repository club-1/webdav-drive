export abstract class Entry {
	constructor(
		public path: string,
		public basename: string,
		public lastmod: string,
		public etag: string | null,
		public checked: boolean = false,
	) { }
}

export class File extends Entry {
	constructor(
		path: string,
		basename: string,
		lastmod: string,
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
