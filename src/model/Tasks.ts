import type { Inode } from "./Files";
import type { FileSystem } from "./FileSystem";

type TaskType = "copy" | "move";

export abstract class Task {
	constructor(
		protected fs: FileSystem,
		public type: TaskType,
		public files: Inode[],
	) { }

	abstract action(path: string, dest: string): Promise<any>;

	apply(dest: string): Promise<any>[] {
		let promises: Promise<any>[] = [];
		for (const file of this.files) {
			promises.push(this.action(file.path, dest + file.basename));
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
