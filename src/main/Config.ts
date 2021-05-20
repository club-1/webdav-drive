import type { Module } from "./Core";

export type Config = {
	/** URL of the WebDAV server. */
	server_url: string;
	/** Root of the file explorer. {username} will be replaced with the current username. */
	root: string;
	/** Branding configuration. */
	branding: {
		/** Name of this instance of webdav-cloud. */
		site_name: string;
	};
	/** List of modules to load. */
	modules: Module[];
}
