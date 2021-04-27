import type { FileStat, ResponseDataDetailed, WebDAVClient } from "webdav";
import { ab2str } from "../../utils";
import type { FileSystem } from "../FileSystem";
import { Entry, File, Directory } from "../Files";

export class WebdavFileSystem implements FileSystem {
	constructor(
		protected client: WebDAVClient,
		protected root: string = "/",
	) { }

	getRoot(): string {
		return this.root;
	}

	async listFiles(path: string): Promise<Entry[]> {
		if (path.charAt(path.length - 1) != "/") {
			throw new Error("Not a directory.");
		} else if (!path.startsWith(this.root)) {
			throw new Error("Permission denied.");
		}
		let res = await this.client.getDirectoryContents(path);
		return extractData(res).map((stat) => createEntry(stat));
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

	putFileContent(path: string, data: string | Buffer): Promise<boolean> {
		return this.client.putFileContents(path, data);
	}

	createDirectory(path: string): Promise<void> {
		return this.client.createDirectory(path);
	}

	async createFile(path: string): Promise<boolean> {
		return this.putFileContent(path, "");
	}

	deleteFile(path: string): Promise<void> {
		return this.client.deleteFile(path);
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

function createEntry(stat: FileStat): Entry {
	if (stat.type == "directory") {
		return new Directory(
			stat.filename,
			stat.basename,
			stat.lastmod,
			stat.etag,
		);
	} else {
		return new File(
			stat.filename,
			stat.basename,
			stat.lastmod,
			stat.etag,
			stat.size,
			stat.mime!
		);
	}
}
