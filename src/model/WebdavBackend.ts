import type { AuthType, FileStat, ResponseDataDetailed, WebDAVClient } from "webdav";
import { createClient } from "webdav/web";
import { ab2str } from "../utils";
import type { Backend } from "./Backend";


export class WebdavBackend implements Backend {
	protected client: WebDAVClient | null = null;

	constructor(
		protected serverUrl: string,
		protected authType: AuthType
	) { }

	async login(username: string, password: string): Promise<boolean> {
		this.client = createClient(this.serverUrl, {
			authType: this.authType,
			username: username,
			password: password,
		});
		if (!await this.client.exists("/")) {
			this.client = null;
			return false;
		}
		return true;
	}

	logout(): void {
		this.client = null;
	}

	isLogged(): boolean {
		return this.client != null;
	}

	async listFiles(path: string): Promise<FileStat[]> {
		this.requireLogged();
		let res = await this.client!.getDirectoryContents(path);
		return extractData(res);
	}

	async getFileContent(path: string): Promise<string> {
		this.requireLogged();
		let res = await this.client!.getFileContents(path);
		let buf = extractData(res);
		if (typeof buf == "string") {
			return buf;
		} else if (buf instanceof ArrayBuffer) {
			return ab2str(buf);
		} else {
			return buf.toString();
		}
	}

	deleteFile(path: string): Promise<void> {
		this.requireLogged();
		return this.client!.deleteFile(path);
	}

	protected requireLogged():void {
		if (!this.isLogged()) {
			throw new Error("No user logged in.");
		}
	}
}

/**
 * Extract data from a WebDAV response.
 * @param res the response from WebDAVClient.
 * @returns the data.
 */
export function extractData<T>(res: T | ResponseDataDetailed<T>): T {
	if (isDetailedData(res)) {
		return res.data;
	} else {
		return res;
	}
}
/** Check if res is detailed response. */
function isDetailedData(res: any | ResponseDataDetailed<any>): res is ResponseDataDetailed<any> {
	return (res as ResponseDataDetailed<any>).data !== undefined;
}
