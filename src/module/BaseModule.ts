import type { Core, Module } from "../main/Core";
import type { InodeProperty } from "../model/Files";

export class BaseModule implements Module {
	init(core: Core) {
		let baseProps: Record<string, InodeProperty<any>> = {
			path: {
				read: (e) => e.path,
			},
			basename: {
				read: (e) => e.basename,
			},
			lastmod: {
				read: (e) => e.lastmod,
			},
			etag: {
				read: (e) => e.etag,
			},
			checked: {
				read: (e) => e.checked,
			},
		}
		for (const [key, prop] of Object.entries(baseProps)) {
			core.registerInodeProperty(key, prop);
		}
		core.registerFileProperty("size", {
			read: (f) => f.size,
		});
		core.registerFileProperty("mime", {
			read: (f) => f.mime,
		});
	}
}
