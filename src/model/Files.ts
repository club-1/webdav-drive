import type { Listable } from "./Generics";

type PropertyGen = (e: Entry) => string;
export type PropertyGenMap = Map<string, PropertyGen>;

export abstract class Entry implements Listable {
	constructor(
		protected propertyMap: PropertyGenMap,
		public path: string,
		public basename: string,
		public lastmod: Date,
		public etag: string | null,
		public checked: boolean = false,
	) { }

	list(): Map<string, string> {
		let map = new Map<string, string>();
		for (const [key, gen] of this.propertyMap.entries()) {
			map.set(key, gen(this));
		}
		return map;
	}

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
		propertyMap: PropertyGenMap,
		path: string,
		basename: string,
		lastmod: Date,
		etag: string | null,
		public size: number,
		public mime: string,
		checked: boolean = false,
	) {
		super(propertyMap, path, basename, lastmod, etag, checked);
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

export class PropertyBuilder {
	protected static baseProps: PropertyGenMap = new Map([
		['path', (e: Entry) => e.path],
		['basename', (e: Entry) => e.basename],
		['lastmod', (e: Entry) => e.lastmod.toString()],
		['etag', (e: Entry) => e.etag || ""],
		['checked', (e: Entry) => e.checked ? "true" : "false"],
	])

	protected directoryProps: PropertyGenMap = PropertyBuilder.baseProps;
	protected fileProps: PropertyGenMap = PropertyBuilder.baseProps;

	constructor() {
		this.registerFileProp("size", (f: File) => f.size.toString());
		this.registerFileProp("mime", (f: File) => f.mime);
	}

	registerCommonProp(key: string, gen: PropertyGen) {
		this.directoryProps.set(key, gen);
		this.fileProps.set(key, gen);

	}

	registerFileProp(key: string, gen: (f: File) => string) {
		this.fileProps.set(key, gen as PropertyGen);
	}

	buildDirectoryProps(): PropertyGenMap {
		return this.directoryProps;
	}

	buildFileProps(): PropertyGenMap {
		return this.fileProps;
	}
}
