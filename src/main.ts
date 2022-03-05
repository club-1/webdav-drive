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
import en from "../locales/translation-en";
import { AuthType, WebdavFileSystemProvider } from "./model/webdav/WebdavFileSystemProvider";
import type { Config } from "./main/Config";
import { Core, type Module } from "./main/Core";

async function main(): Promise<App> {
	const errors: Error[] = [];

	// Load config
	const config = (await import("../config")).default as Config;
	const provider = new WebdavFileSystemProvider(config.server_url, AuthType.Password);

	// Load modules
	const core = new Core();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const modules: Promise<{ module: any, file: string }>[] = [];
	for (const name of config.modules) {
		const file = "./" + name + ".js";
		modules.push(import(file)
			.then(module => { return { module: module.default, file }; })
			.catch((err) => { throw new Error(`${err} "${file}"`); })
		);
	}

	// Init translations
	addMessages("en", en);
	register("fr", () => import("../locales/translation-fr"));
	init({
		fallbackLocale: "en",
	});

	// Init modules
	for (const response of await Promise.allSettled(modules)) {
		if (response.status != "fulfilled") {
			errors.push(response.reason);
			continue;
		}
		try {
			const module = new response.value.module() as Module;
			module.init(core);
		} catch (err) {
			errors.push(new Error(`Unable to init module "${response.value.file}"`));
		}
	}

	// Init app
	return new App({
		target: document.body,
		props: {
			provider,
			config,
			errors,
		},
	});
}

export default main();
