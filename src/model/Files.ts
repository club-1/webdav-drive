import type { Listable } from "../main/Generics";

export type Property<T, U> = {
	read: (e: T) => U,
};
export type EntryProperty<T> = Property<Entry, T>;
export type FileProperty<T> = Property<File, T>;

export type PropertyMap = Map<string, EntryProperty<any>>;

export abstract class Entry implements Listable {
	constructor(
		protected properties: PropertyMap,
		public path: string,
		public basename: string,
		public lastmod: Date,
		public etag: string | null,
		public checked: boolean = false,
	) { }

	list(): Map<string, any> {
		let map = new Map<string, any>();
		for (const [key, prop] of this.properties.entries()) {
			map.set(key, prop.read(this));
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
		properties: PropertyMap,
		path: string,
		basename: string,
		lastmod: Date,
		etag: string | null,
		public size: number,
		public mime: string,
		checked: boolean = false,
	) {
		super(properties, path, basename, lastmod, etag, checked);
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
