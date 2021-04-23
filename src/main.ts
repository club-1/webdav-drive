import App from './App.svelte';
import { AuthType, createClient } from "webdav/web";
import * as config from "../config.json";
import type { WebDAVClient } from 'webdav';

const client: WebDAVClient = createClient(config.server_url, {
    authType: AuthType.Password,
    username: config.username,
    password: config.password
});

let app = new App({
	target: document.body,
	props: {
		client
	}
});

export default app;
