import App from "./App.svelte";
import { AuthType } from "webdav/web";
import * as config from "../config.json";
import { WebdavBackend } from "./model/Backend";

let backend = new WebdavBackend(config.server_url, AuthType.Password);

let app = new App({
	target: document.body,
	props: {
		backend: backend,
		root: config.root,
	}
});

export default app;
