import type { FileStat } from "webdav";

export interface Backend {
	/**
	 * Log a user in.
	 * @param username the user's name.
	 * @param password the user's password.
	 * @returns success.
	 */
	login(username: string, password: string): Promise<boolean>;

	/**
	 * Log a user out.
	 */
	logout(): void;

	/**
	 * Check if a user is currently logged in.
	 */
	isLogged(): boolean;

	/**
	 * List files of a directory.
	 * @param path the path of the directory.
	 * @returns a list of files.
	 */
	listFiles(path: string): Promise<FileStat[]>;

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
