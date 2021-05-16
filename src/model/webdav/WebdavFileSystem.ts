import type { FileStat, ResponseDataDetailed, WebDAVClient } from "webdav";
import { ab2str } from "../../utils";
import { Column, Direction, FileSystem, FileSystemBase } from "../FileSystem";
import { Entry, File, Directory } from "../Files";

export class WebdavFileSystem extends FileSystemBase implements FileSystem {
	constructor(
		protected client: WebDAVClient,
		protected root: string = "",
	) {
		super();
	}

	getRoot(): string {
		return this.root;
	}

	async listFiles(path: string, orderBy: Column = "basename", direction: Direction = "ASC"): Promise<Entry[]> {
		if (path.charAt(path.length - 1) != "/") {
			throw new Error("Not a directory.");
		}
		let res = await this.client.getDirectoryContents(this.root + path, {details: true});
		let files = extractData(res).map((stat) => createEntry(stat, this.root));
		return this.sortFiles(files, orderBy, direction);
	}

	getFileDownloadLink(path: string): string {
		return this.client.getFileDownloadLink(this.root + path);
	}

	async getFileContent(path: string): Promise<string> {
		let res = await this.client.getFileContents(this.root + path);
		let buf = extractData(res);
		if (typeof buf == "string") {
			return buf;
		} else if (buf instanceof ArrayBuffer) {
			return ab2str(buf);
		} else {
			return buf.toString();
		}
	}

	putFileContent(path: string, data: string | Buffer | ArrayBuffer): Promise<boolean> {
		return this.client.putFileContents(this.root + path, data);
	}

	createDirectory(path: string): Promise<void> {
		return this.client.createDirectory(this.root + path);
	}

	async createFile(path: string): Promise<boolean> {
		return this.putFileContent(this.root + path, "");
	}

	deleteFile(path: string): Promise<void> {
		return this.client.deleteFile(this.root + path);
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

function createEntry(stat: FileStat, root: string = ""): Entry {
	if (stat.type == "directory") {
		return new Directory(
			stat.filename.substring(root.length),
			stat.basename,
			new Date(stat.lastmod),
			stat.etag,
		);
	} else {
		return new File(
			stat.filename.substring(root.length),
			stat.basename,
			new Date(stat.lastmod),
			stat.etag,
			stat.size,
			stat.mime!
		);
	}
}
