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

import type { Core, Module } from "../main/Core";
import { File, type InodeOperation } from "../model/Files";

const list: InodeOperation<Map<string,unknown>> = (i, map) => {
	map.set("path", i.path);
	map.set("basename", i.basename);
	map.set("lastmod", i.lastmod);
	map.set("etag", i.etag);
	if (i instanceof File) {
		map.set("size", i.size);
		map.set("mime", i.mime);
	}
	return map;
};

const isHidden: InodeOperation<boolean> = (i) => {
	return i.basename.startsWith(".");
};

const getIconChar: InodeOperation<string> = (i, prev) => {
	if (i instanceof File) {
		switch (i.mime.split("/")[0]) {
		case "image":
			return "🖼️";
		case "video":
			return "🎞️";
		default:
			return prev;
		}
	}
	return "📁";
};

export default class BaseModule implements Module {
	init(core: Core): void {
		core.addInodeOperations({
			list,
			isHidden,
			getIconChar,
		});
	}
}
