import type { Core, Module } from "../main/Core";
import { Directory } from "../model/Files";

type PosixProperties = {
	links: number,
}

export class PosixModule implements Module {
	init(core: Core) {
		core.registerInodeProperty("links", {
			 read: (i): number => {
				let props = i.raw as PosixProperties;
				return props.links;
			},
		});
	}
}
