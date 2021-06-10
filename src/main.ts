import "carbon-components-svelte/css/all.css";
import App from "./App.svelte";
import { AuthType } from "webdav/web";
import configFile from "../config";
import { WebdavFileSystemProvider } from "./model/webdav/WebdavFileSystemProvider";
import type { Config } from "./main/Config";
import { Core } from "./main/Core";

const config = configFile as Config;
const provider = new WebdavFileSystemProvider(config.server_url, AuthType.Password, config.root);

const core = new Core();

for (const module of config.modules) {
	module.init(core);
}

const app = new App({
	target: document.body,
	props: {
		provider,
		config,
	}
});

export default app;
