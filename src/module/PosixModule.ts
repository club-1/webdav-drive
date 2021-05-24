import type { Core, Module } from "../main/Core";

type PosixProperties = {
	mode: number,
	user: string,
	group: string,
	atime: number,
	ctime: number,
	link?: string,
}

export class PosixModule implements Module {
	init(core: Core) {
		core.registerInodeProperty("mode", {
			read: (i): string => {
				let props = i.raw as PosixProperties;
				return props.mode.toString(8);
			},
		});
		core.registerInodeProperty("user", {
			read: (i): string => {
				let props = i.raw as PosixProperties;
				return props.user;
			},
		});
		core.registerInodeProperty("group", {
			read: (i): string => {
				let props = i.raw as PosixProperties;
				return props.group;
			},
		});
		core.registerInodeProperty("atime", {
			read: (i): Date => {
				let props = i.raw as PosixProperties;
				return new Date(props.atime * 1000);
			},
		});
		core.registerInodeProperty("ctime", {
			read: (i): Date => {
				let props = i.raw as PosixProperties;
				return new Date(props.ctime * 1000);
			},
		});
		core.registerInodeProperty("link", {
			read: (i): string | false => {
				let props = i.raw as PosixProperties;
				return props.link || false;
			},
		});
	}
}
