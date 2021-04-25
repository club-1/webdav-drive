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
	 * Delete a file.
	 * @param path the path of the file.
	 * @returns success.
	 */
	deleteFile(path: string): Promise<void>;
}
