import type { Entry } from "./Files";

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
	listFiles(path: string): Promise<Entry[]>;

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
