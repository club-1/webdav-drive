import type { AuthType, FileStat, ResponseDataDetailed, WebDAVClient } from "webdav";
import { createClient } from "webdav/web";
import { ab2str } from "../utils";

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
		return extractData(res);
	}

	async getFileContent(path: string): Promise<string> {
		let res = await this.client.getFileContents(path);
		let buf = extractData(res);
		if (typeof buf == "string") {
			return buf;
		} else if (buf instanceof ArrayBuffer) {
			return ab2str(buf);
		} else {
			return buf.toString();
		}
	}
}

function extractData<T>(res: T | ResponseDataDetailed<T>): T {
	if (isDetailedData(res)) {
		return res.data;
	} else {
		return res;
	}
}

function isDetailedData(res: any | ResponseDataDetailed<any>): res is ResponseDataDetailed<any> {
	return (res as ResponseDataDetailed<any>).data !== undefined;
}
