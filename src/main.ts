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
import type { Config } from "./main/Config";
import { Core, type Module } from "./main/Core";

export const VERSION = '$VERSION';
const errors: Error[] = [];
async function main(): Promise<unknown> {
	console.log(VERSION);

	// Load base app
	const configMod = fetch("app/config.json");
	const webdavMod = import("./model/webdav/WebdavFileSystemProvider");
	const appMod = import("./App.svelte");

	// Load modules
	const core = new Core();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const modules: Promise<{ module: any, file: string }>[] = [];
	const config = await (await configMod).json() as Config;
	for (const name of config.modules) {
		const file = "./module/" + name + ".js";
		modules.push(import(file)
			.then(module => { return { module: module.default, file }; })
			.catch((err) => { throw new Error(`${err} "${file}"`); })
		);
	}

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
	const webdav = await webdavMod;
	return new (await appMod).default({
		target: document.body,
		props: {
			provider: new webdav.WebdavFileSystemProvider(config.server_url, webdav.AuthType.Password),
			config,
			errors,
		},
	});
}

export default main();
