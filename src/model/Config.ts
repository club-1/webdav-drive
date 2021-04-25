export type Config = {
	/** URL of the WebDAV server */
	server_url: string,
	/** Root of the file explorer */
	root: string,
	/** Branding configuration */
	branding: {
		/** Name of this instance of webdav-cloud */
		site_name: string
	}
}
