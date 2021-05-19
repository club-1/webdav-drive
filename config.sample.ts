import type { Config } from "./src/main/Config";
import { BaseModule } from "./src/module/BaseModule";
import { PosixModule } from "./src/module/PosixModule";

export default {
	server_url: "https://webdav.example.fr",
	root: "/files/{username}",
	branding: {
		site_name: "WebDAV Drive",
	},
	modules: [
		new BaseModule(),
		// new PosixModule(),
	],
} as Config
