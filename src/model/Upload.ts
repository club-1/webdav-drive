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
		public controller: AbortController,
		public progress?: Progress,
	) { }
}

export function uploadFiles(fs: FileSystem, path: string, files: File[], progressHandler?: ProgressHandler): FileUpload[] {
	// Collect unique directories.
	const dirs = new Set<string>();
	for (const file of files) {
		if (file.webkitRelativePath) {
			const dir = path + parent(file.webkitRelativePath);
			dirs.add(dir);
		}
	}

	// Make sure there are no gaps in parents.
	for (let dir of dirs) {
		while (true) {
			dir = parent(dir);
			if (dir == path || dirs.has(dir)) {
				break;
			}
			dirs.add(dir);
		}
	}


	// Create directories asynchronously and keep promises.
	const dirPromises = new Map<string, Promise<void>>();
	for (const dir of Array.from(dirs).sort()) {
		// Make sure the parent is created beforehand.
		let createParent = dirPromises.get(parent(dir));
		if (!createParent) {
			createParent = Promise.resolve();
		}

		const promise = createParent
			.then(() => fs.exists(dir))
			.then((exists: boolean) => {
				if (!exists) {
					return fs.createDirectory(dir);
				}
			});
		dirPromises.set(dir, promise);
	}

	const uploads: FileUpload[] = [];

	for (const file of files) {
		let createDir: Promise<void> = Promise.resolve();

		// Check if we need to create a directory.
		if (file.webkitRelativePath) {
			const dir = path + parent(file.webkitRelativePath);
			createDir = dirPromises.get(dir)!;
		}

		const filePath = path + (file.webkitRelativePath || file.name);
		const getContent = createDir.then(() => file.arrayBuffer());
		const controller = new AbortController();
		const upload = new FileUpload(
			file,
			getContent.then((content) => {
				return fs.putFileContent(filePath, content, (p: Progress) => {
					upload.progress = p;
					if (progressHandler) {
						progressHandler(p);
					}
				}, controller.signal);
			}),
			controller,
		);
		uploads.push(upload);
	}

	return uploads;
}
