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

import type { Inode } from "./Files";
import type { FileSystem } from "./FileSystem";

type TaskType = "copy" | "move";

export abstract class Task {
	constructor(
		protected fs: FileSystem,
		public type: TaskType,
		public files: Inode[],
	) { }

	abstract action(path: string, dest: string): Promise<unknown>;

	apply(dest: string): Promise<unknown>[] {
		const promises: Promise<unknown>[] = [];
		let promise: Promise<unknown>;
		for (const file of this.files) {
			promise = this.action(file.path, dest + file.basename)
				.catch((e: Error) => {
					throw new Error(`${e.message} (${file.basename})`);
				});
			promises.push(promise);
		}
		return promises;
	}

	label(): string {
		return this.type.charAt(0).toUpperCase() + this.type.slice(1);
	}
}

export class CopyTask extends Task {
	constructor(fs: FileSystem, files: Inode[]) {
		super(fs, "copy", files);
	}
	action = this.fs.copyFile.bind(this.fs);
}

export class MoveTask extends Task {
	constructor(fs: FileSystem, files: Inode[]) {
		super(fs, "move", files);
	}
	action = this.fs.moveFile.bind(this.fs);
}
