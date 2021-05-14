import type { Entry } from "./Files";

export type Column = "basename" | "lastmod";
export type Direction = "ASC" | "DESC";

export interface FileSystem {
	/**
	 * Get file system root.
	 */
	getRoot(): string;
	/**
	 * List entries of a directory.
	 * @param path the path of the directory.
	 * @returns a list of entries.
	 */
	listFiles(path: string, orderby?: Column, direction?: Direction): Promise<Entry[]>;

	/**
	 * Get the download link of a file.
	 * @param path the path of the file.
	 * @returns the download link for this file.
	 */
	getFileDownloadLink(path: string): string;

	/**
	 * Get the content of a file.
	 * @param path the path of the file.
	 * @returns the content of the file.
	 */
	getFileContent(path: string): Promise<string>;

	/**
	 * Write data to a file.
	 * @param path the path of the file.
	 * @param data the data to write.
	 * @returns success.
	 */
	putFileContent(path: string, data: string | Buffer): Promise<boolean>;

	/**
	 * Create a new directory.
	 * @param path the path of the new directory.
	 */
	createDirectory(path: string): Promise<void>;

	/**
	 * Create a new file.
	 * @param path the path of the file.
	 * @returns false if the file already existed.
	 */
	createFile(path: string): Promise<boolean>;

	/**
	 * Delete a file.
	 * @param path the path of the file.
	 * @returns success.
	 */
	deleteFile(path: string): Promise<void>;
}

export abstract class FileSystemBase {

	protected compareStrings(a: string, b: string) {
		var nameA = a.toUpperCase(); // ignore upper and lowercase
		var nameB = b.toUpperCase(); // ignore upper and lowercase
		if (nameA < nameB) {
			return -1;
		}
		if (nameA > nameB) {
			return 1;
		}
		// names must be equal
		return 0;
	}

	sortFiles(files: Entry[], orderBy: Column, direction: Direction): Entry[] {
		switch (orderBy) {
			case "basename":
				if (direction == "ASC") {
					return files.sort((a, b) => { return this.compareStrings(a.basename, b.basename) });
				} else {
					return files.sort((a, b) => { return this.compareStrings(a.basename, b.basename) * -1 });
				}
			case "lastmod":
				if (direction == "ASC") {
					return files.sort((a, b) => { return (a.lastmod.getTime() - b.lastmod.getTime()) });
				} else {
					return files.sort((a, b) => { return (a.lastmod.getTime() - b.lastmod.getTime()) * -1 });
				}
		}
	}
}
