import App from "./App.svelte";
import { AuthType } from "webdav/web";
import * as configFile from "../config.json";
import { WebdavFileSystemProvider } from "./model/webdav/WebdavFileSystemProvider";
import type { Config } from "./model/Config";
import { Core } from "./model/Core";
import { Directory, Entry, PropertyBuilder } from "./model/Files";

let config = configFile as Config;
let provider = new WebdavFileSystemProvider(config.server_url, AuthType.Password, config.root);

let core = new Core();
let propBuilder = new PropertyBuilder();

// Just a test to see if plugins can add properties.
propBuilder.registerCommonProp("type", (e: Entry) => {
	return e instanceof Directory ? "directory" : "file";
});

core.directoryProps = propBuilder.buildDirectoryProps();
core.fileProps = propBuilder.buildFileProps();

let app = new App({
	target: document.body,
	props: {
		provider,
		config,
	}
});

export default app;
