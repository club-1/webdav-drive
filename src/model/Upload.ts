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

import { parent } from "../utils";
import type { FileSystem } from "./FileSystem";

export type Progress = {
	loaded: number,
	total: number,
}

export type ProgressHandler = (p: Progress) => unknown

export class FileUpload {
	constructor(
		public file: File,
		public success: Promise<boolean>,
		public progress?: Progress,
	) { }
}

export async function uploadFiles(fs: FileSystem, path: string, files: File[], progressHandler?: ProgressHandler): Promise<FileUpload[]> {
	const directories = new Set<string>();
	for (const file of files) {
		if (!file.webkitRelativePath) {
			continue;
		}
		const directory = path + parent(file.webkitRelativePath);
		directories.add(directory);
	}

	for (const directory of directories) {
		if (!(await fs.exists(directory))) {
			await fs.createDirectory(directory, true);
		}
	}

	const uploads: FileUpload[] = [];
	for (const file of files) {
		const filePath = path + (file.webkitRelativePath || file.name);
		const content = await file.arrayBuffer();
		const upload = new FileUpload(
			file,
			fs.putFileContent(filePath, content, (p: Progress) => {
				upload.progress = p;
				if (progressHandler) {
					progressHandler(p);
				}
			})
		);
		uploads.push(upload);
	}

	return uploads;
}
