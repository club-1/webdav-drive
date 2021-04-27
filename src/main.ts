import App from "./App.svelte";
import { AuthType } from "webdav/web";
import * as configFile from "../config.json";
import { WebdavFileSystemProvider } from "./model/webdav/WebdavFileSystemProvider";
import type { Config } from "./model/Config";

let config = configFile as Config;
let provider = new WebdavFileSystemProvider(config.server_url, AuthType.Password, config.root);

let app = new App({
	target: document.body,
	props: {
		provider,
		config,
	}
});

export default app;
