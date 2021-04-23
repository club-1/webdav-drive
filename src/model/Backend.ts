import type { AuthType, FileStat, WebDAVClient } from "webdav";
import { createClient } from "webdav/web";

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
}

export class WebdavBackend implements Backend {
	protected client: WebDAVClient | null = null;
	protected logged = false;

	constructor(
		protected serverUrl: string,
		protected authType: AuthType,
	) { }

	async login(username: string, password: string): Promise<boolean> {
		this.client = createClient(this.serverUrl, {
			authType: this.authType,
			username: username,
			password: password,
		});
		this.logged = await this.client.exists("/");
		return this.logged;
	}

	logout(): void {
		this.client = null;
		this.logged = false;
	}

	isLogged(): boolean {
		return this.logged;
	}

	async listFiles(path: string): Promise<FileStat[]> {
		let res = await this.client.getDirectoryContents(path);
		if (Array.isArray(res)) {
			return res;
		} else {
			return res.data;
		}
	}
}
