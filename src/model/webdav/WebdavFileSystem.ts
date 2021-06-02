import type { FileStat, ResponseDataDetailed, WebDAVClient } from "webdav/web";
import { ab2str } from "../../utils";
import { Column, Direction, FileSystem, FileSystemBase } from "../FileSystem";
import { Inode, File, Directory } from "../Files";
import type { Progress } from "../Upload";

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

	async listFiles(path: string, orderBy: Column = "basename", direction: Direction = "ASC"): Promise<Inode[]> {
		if (path.charAt(path.length - 1) != "/") {
			throw new Error("Not a directory.");
		}
		let res = await this.client.getDirectoryContents(this.root + path, { details: true });
		let files = extractData(res).map((stat) => this.createInode(stat));
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

	putFileContent(path: string, data: string | Buffer | ArrayBuffer, progressHandler?: (p: Progress) => any): Promise<boolean> {
		return this.client.putFileContents(this.root + path, data, {
			onUploadProgress: progressHandler,
			contentLength: false,
		});
	}

	createDirectory(path: string): Promise<void> {
		return this.client.createDirectory(this.root + path);
	}

	async createFile(path: string): Promise<boolean> {
		return this.putFileContent(path, "");
	}

	deleteFile(path: string): Promise<void> {
		return this.client.deleteFile(this.root + path);
	}

	moveFile(path: string, dest: string): Promise<void> {
		return this.client.moveFile(this.root + path, this.root + dest);
	}

	copyFile(path: string, dest: string): Promise<void> {
		return this.client.copyFile(this.root + path, this.root + dest);
	}

	/**
	 * Create a File or Directory object from its status.
	 * @param stat status of the file.
	 * @returns the file or directory object
	 */
	createInode(stat: FileStat): Inode {
		if (stat.type == "directory") {
			return new Directory(
				this.directoryProps,
				stat.props || {},
				stat.filename.substring(this.rootLength()),
				stat.basename,
				new Date(stat.lastmod),
				stat.etag,
			);
		} else {
			return new File(
				this.fileProps,
				stat.props || {},
				stat.filename.substring(this.rootLength()),
				stat.basename,
				new Date(stat.lastmod),
				stat.etag,
				stat.size,
				stat.mime!
			);
		}
	}

	protected rootLength(): number { return this.root.length }
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
