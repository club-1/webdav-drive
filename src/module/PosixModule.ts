import type { Core, Module } from "../main/Core";
import { Directory } from "../model/Files";

export class PosixModule implements Module {
	init(core: Core) {
		core.registerInodeProperty("type", {
			read: (e) => {
				return e instanceof Directory ? "directory" : "file";
			},
		});
	}
}