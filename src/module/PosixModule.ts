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
};

const getName: InodeOperation<string> = (i, prev) => {
	const props = i.raw as PosixProperties;
	if (props.link) {
		return prev + " ⇢ " + props.link;
	}
	return prev;
};

const getIconChar: InodeOperation<string> = (i, prev) => {
	const props = i.raw as PosixProperties;
	if (props.link) {
		return "↪";
	}
	return prev;
};

export class PosixModule implements Module {
	init(core: Core): void {
		core.addInodeOperations({
			list,
			getName,
			getIconChar,
		});
	}
}
