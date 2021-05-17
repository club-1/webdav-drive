import type { PropertyGenMap } from "./Files";

export class Core {
	protected static directoryProps: PropertyGenMap;
	protected static fileProps: PropertyGenMap;

	public static getDirectoryProps() : PropertyGenMap {
		return Core.directoryProps;
	}

	public static getFileProps() : PropertyGenMap {
		return Core.fileProps;
	}

	public set directoryProps(v : PropertyGenMap) {
		Core.directoryProps = v;
	}

	public set fileProps(v : PropertyGenMap) {
		Core.fileProps = v;
	}
	
}
