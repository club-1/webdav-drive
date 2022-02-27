import type { Core, Module } from "../main/Core";
import type { InodeOperation } from "../model/Files";

type PosixProperties = {
	mode: number,
	user: string,
	group: string,
	atime: number,
	ctime: number,
	link?: string,
}

const list: InodeOperation<Map<string,unknown>> = (i, map) => {
	const props = i.raw as PosixProperties;
	map.set("mode", props.mode.toString(8));
	map.set("user", props.user);
	map.set("group", props.group);
	map.set("atime", new Date(props.atime * 1000));
	map.set("ctime", new Date(props.ctime * 1000));
	map.set("link", props.link || false);
	return map;
}

const getIconChar: InodeOperation<string> = (i, prev) => {
	const props = i.raw as PosixProperties;
	if (props.link) {
		return "↪";
	}
	return prev
}

export class PosixModule implements Module {
	init(core: Core): void {
		core.addInodeOperations({
			list,
			getIconChar,
		});
	}
}
