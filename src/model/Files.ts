export abstract class Entry {
	constructor(
		public path: string,
		public basename: string,
		public lastmod: Date,
		public etag: string | null,
		public checked: boolean = false,
	) { }

	/**
	 * Check if an entry is hidden.
	 * @returns true if the entry is hidden.
	 */
	isHidden(): boolean {
		return this.basename.startsWith(".");
	}

	/**
	 * Get the icon's emoji of an entry.
	 * @returns the icon's emoji of this entry.
	 */
	abstract getIconChar(): string;
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

	getIconChar(): string {
		switch (this.mime.split("/")[0]) {
			case "image":
				return "🖼️";
			case "video":
				return "🎞️";
			default:
				return "📄";
		}
	}
}

export class Directory extends Entry {
	getIconChar(): string {
		return "📁";
	}
}
