import type { FileProperty, InodeProperty, InodeProperties } from "../model/Files";

export interface Module {
	init(core: Core): void;
}

export class Core {
	protected static directoryProps: InodeProperties = new Map();
	protected static fileProps: InodeProperties = new Map();

	public static getDirectoryProps(): InodeProperties {
		return Core.directoryProps;
	}

	public static getFileProps(): InodeProperties {
		return Core.fileProps;
	}

	registerInodeProperty(key: string, prop: InodeProperty<any>) {
		Core.directoryProps.set(key, prop);
		Core.fileProps.set(key, prop);

	}

	registerFileProperty(key: string, prop: FileProperty<any>) {
		Core.fileProps.set(key, prop as InodeProperty<any>);
	}

}
