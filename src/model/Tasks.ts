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
}

export class CopyTask extends Task {
	constructor(fs: FileSystem, files: Inode[]) {
		super(fs, "copy", files);
	}
	action = this.fs.copyFile.bind(this.fs)
}

export class MoveTask extends Task {
	constructor(fs: FileSystem, files: Inode[]) {
		super(fs, "move", files);
	}
	action = this.fs.moveFile.bind(this.fs)
}
