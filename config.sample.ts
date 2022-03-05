import type { Config } from "./src/main/Config";

export default {
	server_url: "https://webdav.example.fr/files/{username}",
	max_body_size: 0x100000,
	branding: {
		site_name: "WebDAV Drive",
	},
	modules: [
		"BaseModule",
		// "PosixModule",
	],
} as Config
