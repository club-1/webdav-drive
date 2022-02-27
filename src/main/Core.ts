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

import { Inode, type InodeOperation } from "../model/Files";

export type InodeOperations = {
	/** Display a map of properties */
	list?: InodeOperation<Map<string, unknown>>,
	isHidden?: InodeOperation<boolean>,
	getName?: InodeOperation<string>,
	getIconChar?: InodeOperation<string>,
}

export interface Module {
	init(core: Core): void;
}

export class Core {

	addInodeOperations(operations: InodeOperations): void {
		operations.list && Inode.operations.list.push(operations.list);
		operations.isHidden && Inode.operations.isHidden.push(operations.isHidden);
		operations.getName && Inode.operations.getName.push(operations.getName);
		operations.getIconChar && Inode.operations.getIconChar.push(operations.getIconChar);
	}

}
