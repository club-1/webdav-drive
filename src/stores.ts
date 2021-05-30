import { writable } from 'svelte/store';

/** Currently loading item. */
export const loading = writable("");

/** Last file list update number. */
export const fileListUpdate = writable(0);

export function fileListUpdateIncr() {
	fileListUpdate.update((value) => value + 1);
}
