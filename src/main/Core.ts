import type { FileProperty, EntryProperty, PropertyMap as EntryProperties } from "../model/Files";

export interface Module {
	init(core: Core): void;
}

export class Core {
	protected static directoryProps: EntryProperties = new Map();
	protected static fileProps: EntryProperties = new Map();

	public static getDirectoryProps(): EntryProperties {
		return Core.directoryProps;
	}

	public static getFileProps(): EntryProperties {
		return Core.fileProps;
	}

	registerEntryProp(key: string, prop: EntryProperty<any>) {
		Core.directoryProps.set(key, prop);
		Core.fileProps.set(key, prop);

	}

	registerFileProp(key: string, prop: FileProperty<any>) {
		Core.fileProps.set(key, prop as EntryProperty<any>);
	}

}
