import { writable } from 'svelte/store';

/** The file currently edited. */
export const fileEdit = writable("");

/** Last file list update number. */
export const fileListUpdate = writable(0);
