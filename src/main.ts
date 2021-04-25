import App from "./App.svelte";
import { AuthType } from "webdav/web";
import * as config from "../config.json";
import { WebdavFileSystemProvider } from "./model/WebdavFileSystemProvider";

let provider = new WebdavFileSystemProvider(config.server_url, AuthType.Password);

let app = new App({
	target: document.body,
	props: {
		provider,
		root: config.root,
	}
});

export default app;
