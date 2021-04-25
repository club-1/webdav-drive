import App from "./App.svelte";
import { AuthType } from "webdav/web";
import * as config from "../config.json";
import { WebdavFileSystem } from "./model/WebdavFileSystem";

let fs = new WebdavFileSystem(config.server_url, AuthType.Password);

let app = new App({
	target: document.body,
	props: {
		fs: fs,
		root: config.root,
	}
});

export default app;
