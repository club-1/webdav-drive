import type { Core, Module } from "../main/Core";
import type { InodeProperty } from "../model/Files";

export class BaseModule implements Module {
	init(core: Core) {
		let baseProps: Record<string, InodeProperty<any>> = {
			path: {
				read: (i): string => i.path,
			},
			basename: {
				read: (i): string => i.basename,
			},
			lastmod: {
				read: (i): Date => i.lastmod,
			},
			etag: {
				read: (i): string | null => i.etag,
			},
			checked: {
				read: (i): boolean => i.checked,
			},
		}
		for (const [key, prop] of Object.entries(baseProps)) {
			core.registerInodeProperty(key, prop);
		}
		core.registerFileProperty("size", {
			read: (f): number => f.size,
		});
		core.registerFileProperty("mime", {
			read: (f): string => f.mime,
		});
	}
}
