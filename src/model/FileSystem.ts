import { Directory } from "./Directory";
import { File } from "./File";

export interface FileSystem {
	getFiles(): File[]
}

export class DummyFileSystem implements FileSystem {
	getFiles() {
		return [
			new File("file1", 342),
			new File("file2", 9),
			new File("file3", 239235925),
			new File("file4", 0),
			new Directory("dir1"),
		];
	}
}
