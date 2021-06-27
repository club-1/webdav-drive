import { writable } from "svelte/store";

/** Currently loading item. */
export const loading = writable("");

/** Last file list update number. */
export const fileListUpdate = writable(0);

/** If width <= 610 */
export const isSmallScreen = writable(false);

export function fileListUpdateIncr(): void {
	fileListUpdate.update((value) => value + 1);
}
