import { compareStrings, hrsize } from "../utils";
import { File, Inode } from "./Files";

type Diff = 0 | 1 | -1;

type NonEmptyHeader<T> = {
	key: string,
	value: string,
	display?: (v: T) => string,
	sort?: (a: T, b: T) => Diff,
}

type EmptyHeader = {
	key: string,
	empty: boolean,
}

type Header<T> = NonEmptyHeader<T> | EmptyHeader;

type Row = {
	id: string,
	inode: Inode,
}

export type FileTable = {
	headers: (Header<Inode> | Header<Date> | Header<number>)[],
	rows: Row[],
}

export function files2table(files: Inode[]): FileTable {
	const headers = [
		{
			key: "name",
			value: "Name",
			display: (f: Inode) => f.getIconChar() + " " + f.basename,
			sort: (a: Inode, b: Inode) => compareStrings(a.basename, b.basename),
		},
		{
			key: "lastmod",
			value: "Last Modified",
			display: (v: Date) => v.toLocaleString(),
			sort: (a: Date, b: Date) => a.getTime() - b.getTime() as Diff,
		},
		{
			key: "size",
			value: "Size",
			display: (v: number | string) => typeof v == "string" ? v : hrsize(v),
		},

	]
	const rows: Row[] = files
		.filter((f) => !f.isHidden())
		.map((f) => {
			return {
				id: f.basename,
				name: f,
				lastmod: f.lastmod,
				size: (f instanceof File) ? f.size : "-",
				inode: f,
			}
		});
	return { headers, rows }
}
