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

import type { FileSystem } from "../FileSystem";
import type { FileSystemProvider } from "../FileSystemProvider";
import { WebdavFileSystem } from "./WebdavFileSystem";
import { encode } from "utf8";
import { createClient } from "webdav/web";

export enum AuthType {
	Digest = "digest",
	Password = "password",
}

export class WebdavFileSystemProvider implements FileSystemProvider {
	constructor(
		protected serverUrl: string,
		protected authType: AuthType,
	) { }

	async getFileSystem(username: string, password: string): Promise<FileSystem> {
		const serverUrl = this.serverUrl.replace("{username}", username);
		const client = createClient(serverUrl, {
			authType: this.authType,
			username: encode(username),
			password: encode(password),
		});
		if (!await client.exists("/")) {
			throw new Error("Could not access filesystem.");
		}
		return new WebdavFileSystem(client);
	}
}
