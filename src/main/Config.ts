import type { Module } from "./Core";

export type Config = {
	/** URL of the WebDAV server. */
	server_url: string;
	/** Root of the file explorer. {username} will be replaced with the current username. */
	root: string;
	/** Request's max body size accepted by the server. */
	max_body_size: number;
	/** Branding configuration. */
	branding: {
		/** Name of this instance of webdav-cloud. */
		site_name: string;
	};
	/** List of modules to load. */
	modules: Module[];
}
