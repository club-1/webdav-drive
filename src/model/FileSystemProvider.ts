import type { FileSystem } from "./FileSystem";

export interface FileSystemProvider {

	/**
	 * Get a filesystem given a user's credentials.
	 * @param username the user's name.
	 * @param password the user's password.
	 * @returns the filesystem.
	 */
	getFileSystem(username: string, password: string): Promise<FileSystem>;
}
