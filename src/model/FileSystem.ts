import { Core } from "../main/Core";
import { compareStrings } from "../utils";
import type { Inode, InodeProperties } from "./Files";
import type { Progress } from "./Upload";

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
	listFiles(path: string, orderby?: Column, direction?: Direction): Promise<Inode[]>;

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
	 * @param progressHandler callback for progress updates.
	 * @returns success.
	 */
	putFileContent(path: string, data: string | Buffer | ArrayBuffer, progressHandler?: (p: Progress) => unknown): Promise<boolean>;

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

	/**
	 * Move a file to a new path.
	 * @param path the path of the file
	 * @param dest the destination path of the file
	 */
	moveFile(path: string, dest: string): Promise<void>;

	/**
	 * Copy a file to a new path.
	 * @param path the path of the file
	 * @param dest the destination path of the file
	 */
	copyFile(path: string, dest: string): Promise<void>;
}

export abstract class FileSystemBase {
	protected directoryProps: InodeProperties;
	protected fileProps: InodeProperties;

	constructor() {
		this.directoryProps = Core.getDirectoryProps()
		this.fileProps = Core.getFileProps();
	}

	sortFiles(files: Inode[], orderBy: Column, direction: Direction): Inode[] {
		switch (orderBy) {
			case "basename":
				if (direction == "ASC") {
					return files.sort((a, b) => { return compareStrings(a.basename, b.basename) });
				} else {
					return files.sort((a, b) => { return compareStrings(a.basename, b.basename) * -1 });
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
