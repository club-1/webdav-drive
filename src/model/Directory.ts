import { File } from "./File";

export class Directory extends File {
	protected files: File[];

	constructor(name: string) {
		super(name, 0);
	}

	sizeH() {
		return "-";
	}
}
