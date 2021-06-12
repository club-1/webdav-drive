import type { Listable, Property } from "../main/Generics";

export type InodeProperty<T> = Property<Inode, T>;
export type FileProperty<T> = Property<File, T>;

export type InodeProperties = Map<string, InodeProperty<unknown>>;

export abstract class Inode implements Listable {
	constructor(
		protected properties: InodeProperties,
		public raw: object,  // eslint-disable-line @typescript-eslint/ban-types
		public path: string,
		public basename: string,
		public lastmod: Date,
		public etag: string | null,
	) { }

	list(): Map<string, unknown> {
		const map = new Map<string, unknown>();
		for (const [key, prop] of this.properties.entries()) {
			map.set(key, prop.read(this));
		}
		return map;
	}

	/**
	 * Check if an inode is hidden.
	 * @returns true if the inode is hidden.
	 */
	isHidden(): boolean {
		return this.basename.startsWith(".");
	}

	/**
	 * Get the icon's emoji of an inode.
	 * @returns the icon's emoji of this inode.
	 */
	abstract getIconChar(): string;
}

export class File extends Inode {
	constructor(
		properties: InodeProperties,
		raw: object, // eslint-disable-line @typescript-eslint/ban-types
		path: string,
		basename: string,
		lastmod: Date,
		etag: string | null,
		public size: number,
		public mime: string,
	) {
		super(properties, raw, path, basename, lastmod, etag);
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

export class Directory extends Inode {
	getIconChar(): string {
		return "📁";
	}
}
