/*
	This file is part of WebDAV-Drive.

	Copyright 2021, 2022  Nicolas Peugnet<n.peugnet@free.fr>

	WebDAV-Drive is free software: you can redistribute it and/or modify it under
	the terms of the GNU General Public License as published by the Free Software
	Foundation, either version 3 of the License, or (at your option) any later
	version.

	WebDAV-Drive is distributed in the hope that it will be useful, but WITHOUT
	ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
	FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

	You should have received a copy of the GNU General Public License along with
	WebDAV-Drive. If not, see <https://www.gnu.org/licenses/>.
*/

import type { Listable } from "../main/Generics";

export type InodeOperation<T> = (i: Inode, prev: T) => T;

export abstract class Inode implements Listable {

	public static operations: {
		list: InodeOperation<Map<string, unknown>>[],
		isHidden: InodeOperation<boolean>[],
		getName: InodeOperation<string>[],
		getIconChar: InodeOperation<string>[],
	} = {
			list: [],
			isHidden: [],
			getName: [],
			getIconChar: [],
		};

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
	 * Get the display name of an inode.
	 * @returns the display name of this inode.
	 */
	getName(): string {
		return this.callOperations(Inode.operations.getName, this.basename);
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
