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

import { getDateFormatter } from "svelte-i18n";
import { compareStrings, hrsize } from "../utils";
import { File, Inode } from "./Files";
import type { DataTableHeader, DataTableRow } from "carbon-components-svelte/src/DataTable/DataTable.svelte";

type Diff = 0 | 1 | -1;

export type FileTable = {
	headers: DataTableHeader[],
	rows: DataTableRow[],
}

/**
 * Format date based on the current locale.
 * Using a date-tame numeric only style.
 * @param d the date to format
 */
const formatDate = (d: Date) => getDateFormatter({
	year: "numeric", month: "numeric", day: "numeric",
	hour: "numeric", minute: "numeric", second: "numeric",
}).format(d);

export function files2table(files: Inode[]): FileTable {
	return {
		headers: [
			{
				key: "name",
				value: "Name",
				display: (f: Inode) => f.getIconChar() + " " + f.basename,
				sort: (a: Inode, b: Inode) => compareStrings(a.basename, b.basename),
			},
			{
				key: "lastmod",
				value: "Last Modified",
				display: formatDate,
				sort: (a: Date, b: Date) => a.getTime() - b.getTime() as Diff,
			},
			{
				key: "size",
				value: "Size",
				display: (v: number | string) => typeof v == "string" ? v : hrsize(v),
			},
			{
				key: "menu",
				empty: true,
			},
		],
		rows: files
			.filter((f) => !f.isHidden())
			.map((f) => {
				return {
					id: f.basename,
					name: f,
					lastmod: f.lastmod,
					size: (f instanceof File) ? f.size : "-",
					inode: f,
				};
			}),
	};
}
