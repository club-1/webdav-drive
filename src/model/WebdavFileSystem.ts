import type { AuthType, FileStat, ResponseDataDetailed, WebDAVClient } from "webdav";
import { createClient } from "webdav/web";
import { ab2str } from "../utils";
import type { FileSystem } from "./FileSystem";
import { File } from "./File";


export class WebdavFileSystem implements FileSystem {
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

	async listFiles(path: string): Promise<File[]> {
		this.requireLogged();
		let res = await this.client!.getDirectoryContents(path);
		return extractData(res).map((stat) => new File(stat));
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

	putFileContent(path: string, data: string | Buffer): Promise<boolean>{
		this.requireLogged();
		return this.client!.putFileContents(path, data);
	}

	createDirectory(path: string): Promise<void> {
		this.requireLogged();
		return this.client!.createDirectory(path);
	}

	async createFile(path: string): Promise<boolean> {
		this.requireLogged();
		if (await this.client!.exists(path)) {
			let res = await this.client!.stat(path);
			let data = extractData(res);
			if (data.type == "directory") {
				throw new Error(`File already exists but is a directory: '${data.filename}'`);
			}
			return false;
		}
		return this.putFileContent(path, "");
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
function extractData<T>(res: T | ResponseDataDetailed<T>): T {
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
