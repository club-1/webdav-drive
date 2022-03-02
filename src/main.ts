/*
	This file is part of WebDAV-Drive.

	Copyright 2021, 2022  Nicolas Peugnet<n.peugnet@free.fr>

	WebDAV-Drive is free software: you can redistribute it and/or modify it under
	the terms of the GNU General Public License as published by the Free Software
	Foundation, either version 3 of the License, or (at your option) any later
	version.

	WebDAV-Drive is distributed in the hope that it will be useful, but WITHOUT
	ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
	FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

	You should have received a copy of the GNU General Public License along with
	WebDAV-Drive. If not, see <https://www.gnu.org/licenses/>.
*/

import "carbon-components-svelte/css/all.css";
import { register, init, addMessages } from "svelte-i18n";
import App from "./App.svelte";
import configFile from "../config";
import en from "../locales/translation-en";
import { AuthType, WebdavFileSystemProvider } from "./model/webdav/WebdavFileSystemProvider";
import type { Config } from "./main/Config";
import { Core } from "./main/Core";

// Load config
const config = configFile as Config;
const provider = new WebdavFileSystemProvider(config.server_url, AuthType.Password, config.root);

// Init modules
const core = new Core();
for (const module of config.modules) {
	module.init(core);
}

// Init translations
addMessages("en", en);
register("fr", () => import("../locales/translation-fr"));
init({
	fallbackLocale: "en",
});

// Init app
const app = new App({
	target: document.body,
	props: {
		provider,
		config,
	},
});

export default app;
