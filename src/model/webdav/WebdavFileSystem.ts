/*
	This file is part of WebDAV-Drive.

	Copyright 2021, 2022  Nicolas Peugnet<n.peugnet@free.fr>

	WebDAV-Drive is free software: you can redistribute it and/or modify it under
	the terms of the GNU General Public License as published by the Free Software
	Foundation, either version 3 of the License, or (at your option) any later
	version.

	WebDAV-Drive is distributed in the hope that it will be useful, but WITHOUT
	ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
	FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

	You should have received a copy of the GNU General Public License along with
	WebDAV-Drive. If not, see <https://www.gnu.org/licenses/>.
*/

import type { FileStat, ResponseDataDetailed, WebDAVClient } from "webdav/web";
import { ab2str } from "../../utils";
import type { Column, Direction, FileSystem } from "../FileSystem";
import { FileSystemBase } from "../FileSystem";
import { Inode, File, Directory } from "../Files";
import type { Progress } from "../Upload";

export class WebdavFileSystem extends FileSystemBase implements FileSystem {
	constructor(
		protected client: WebDAVClient,
	) {
		super();
	}

	async listFiles(path: string, orderBy: Column = "basename", direction: Direction = "ASC"): Promise<Inode[]> {
		if (path.charAt(path.length - 1) != "/") {
			throw new Error("Not a directory.");
		}
		const res = await this.client.getDirectoryContents(path, { details: true });
		const files = extractData(res).map((stat) => this.createInode(stat));
		return this.sortFiles(files, orderBy, direction);
	}

	getFileDownloadLink(path: string): string {
		return this.client.getFileDownloadLink(path);
	}

	async getFileContent(path: string): Promise<string> {
		const res = await this.client.getFileContents(path);
		const buf = extractData(res);
		if (typeof buf == "string") {
			return buf;
		} else if (buf instanceof ArrayBuffer) {
			return ab2str(buf);
		} else {
			return buf.toString();
		}
	}

	putFileContent(path: string, data: string | Buffer | ArrayBuffer, progressHandler?: (p: Progress) => unknown): Promise<boolean> {
		return this.client.putFileContents(path, data, {
			onUploadProgress: progressHandler,
			contentLength: false,
		});
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

	moveFile(path: string, dest: string): Promise<void> {
		return this.client.moveFile(path, dest);
	}

	copyFile(path: string, dest: string): Promise<void> {
		return this.client.copyFile(path, dest);
	}

	/**
	 * Create a File or Directory object from its status.
	 * @param stat status of the file.
	 * @returns the file or directory object
	 */
	createInode(stat: FileStat): Inode {
		if (stat.type == "directory") {
			return new Directory(
				stat.props || {},
				stat.filename,
				stat.basename,
				new Date(stat.lastmod),
				stat.etag,
			);
		} else {
			return new File(
				stat.props || {},
				stat.filename,
				stat.basename,
				new Date(stat.lastmod),
				stat.etag,
				stat.size,
				stat.mime!
			);
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
function isDetailedData(res: unknown | ResponseDataDetailed<unknown>): res is ResponseDataDetailed<unknown> {
	return (res as ResponseDataDetailed<unknown>).data !== undefined;
}
