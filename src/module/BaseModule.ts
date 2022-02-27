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

export class BaseModule implements Module {
	init(core: Core): void {
		core.addInodeOperations({
			list,
			isHidden,
			getIconChar,
		});
	}
}
