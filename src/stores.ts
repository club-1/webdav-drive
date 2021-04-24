import { writable } from 'svelte/store';

/** True if a user is logged in. */
export const logged = writable(false);
/** The file currently edited. */
export const edit = writable("");
