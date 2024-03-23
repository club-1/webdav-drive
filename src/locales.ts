/*
	This file is part of WebDAV-Drive.

	Copyright 2022  Nicolas Peugnet<n.peugnet@free.fr>

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

import { init, addMessages } from "svelte-intl-precompile";
import { registerAll } from "$locales";
//@ts-ignore
import en from "$locales/en";

// Init localization
addMessages("en", en);
registerAll();
init({
	fallbackLocale: "en",
});

export const labels: Record<string, string> = {
	"en": "English",
	"fr": "Français",
	"nb-NO": "Norsk Bokmål",
	"zh-CN": "中文（简体）",
};
