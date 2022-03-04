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

import type { Module } from "./Core";

export type Config = {
	/** URL of the WebDAV server. {username} will be replaced with the current username. */
	server_url: string;
	/** Request's max body size accepted by the server. */
	max_body_size: number;
	/** Branding configuration. */
	branding: {
		/** Name of this instance of webdav-cloud. */
		site_name: string;
	};
	/** List of modules to load. */
	modules: Module[];
}
