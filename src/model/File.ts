export class File {
	static SIZE_SYMBOLS = ['o', 'Kio', 'Mio', 'Gio', 'Tio'];

	constructor(
		readonly name: string,
		readonly size: number,
	) { }

	sizeH(): string {
		let size = this.size;
		let i = 0;
		while (size >= 1000 && i < File.SIZE_SYMBOLS.length - 1) {
			size /= 1024;
			i++;
		}
		return (i > 1 ? size.toFixed(1) : size) + ' ' + File.SIZE_SYMBOLS[i]
	}
}
