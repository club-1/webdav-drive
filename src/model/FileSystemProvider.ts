import type { FileSystem } from "./FileSystem";

export interface FileSystemProvider {

	/**
	 * Log a user in.
	 * @param username the user's name.
	 * @param password the user's password.
	 * @returns success.
	 */
	getFileSystem(username: string, password: string): Promise<FileSystem>;
}
