export type Progress = {
	loaded: number,
	total: number,
}

export class FileUpload {
	constructor(
		public file: File,
		public progress?: Progress,
	) { }
}
