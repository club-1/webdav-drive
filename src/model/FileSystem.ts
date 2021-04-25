import type { File } from "./File";

export interface FileSystem {
	/**
	 * List files of a directory.
	 * @param path the path of the directory.
	 * @returns a list of files.
	 */
	listFiles(path: string): Promise<File[]>;

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
