import type { DataTableCell, DataTableHeader, DataTableRow } from "carbon-components-svelte/types/DataTable/DataTable";

export type TableEvent = CustomEvent<{
	header?: DataTableHeader;
	row?: DataTableRow;
	cell?: DataTableCell;
}>;
