import type { Listable } from "../main/Generics";

export type InodeOperation<T> = (i: Inode, prev: T) => T;

export abstract class Inode implements Listable {

	public static operations: {
		list: InodeOperation<Map<string, unknown>>[],
		isHidden: InodeOperation<boolean>[],
		getIconChar: InodeOperation<string>[],
	} = {
		list: [],
		isHidden: [],
		getIconChar: []
	}

	constructor(
		public raw: object,  // eslint-disable-line @typescript-eslint/ban-types
		public path: string,
		public basename: string,
		public lastmod: Date,
		public etag: string | null,
	) { }

	protected callOperations<T>(operations: InodeOperation<T>[], value: T) {
		for (const func of operations) {
			value = func(this, value);
		}
		return value;
	}

	list(): Map<string, unknown> {
		return this.callOperations(Inode.operations.list, new Map());
	}

	/**
	 * Check if an inode is hidden.
	 * @returns true if the inode is hidden.
	 */
	isHidden(): boolean {
		return this.callOperations(Inode.operations.isHidden, false);
	}

	/**
	 * Get the icon's emoji of an inode.
	 * @returns the icon's emoji of this inode.
	 */
	getIconChar(): string {
		return this.callOperations(Inode.operations.getIconChar, "📄");
	}
}

export class File extends Inode {
	constructor(
		raw: object, // eslint-disable-line @typescript-eslint/ban-types
		path: string,
		basename: string,
		lastmod: Date,
		etag: string | null,
		public size: number,
		public mime: string,
	) {
		super(raw, path, basename, lastmod, etag);
	}
}

export class Directory extends Inode {}
