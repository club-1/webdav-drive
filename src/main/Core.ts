import { Inode, type InodeOperation } from "../model/Files";

export type InodeOperations = {
	/** Display a map of properties */
	list?: InodeOperation<Map<string, unknown>>,
	isHidden?: InodeOperation<boolean>,
	getIconChar?: InodeOperation<string>,
}

export interface Module {
	init(core: Core): void;
}

export class Core {

	addInodeOperations(operations: InodeOperations): void {
		operations.list && Inode.operations.list.push(operations.list);
		operations.isHidden && Inode.operations.isHidden.push(operations.isHidden);
		operations.getIconChar && Inode.operations.getIconChar.push(operations.getIconChar);
	}

}
