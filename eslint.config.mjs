import eslintPluginSvelte from "eslint-plugin-svelte";
import globals from "globals";
import js from "@eslint/js";
import svelteParser from "svelte-eslint-parser";
import tsEslint from "typescript-eslint";
import tsParser from "@typescript-eslint/parser";

export default [
	js.configs.recommended,
	...tsEslint.configs.strict,
	...eslintPluginSvelte.configs["flat/recommended"],
	{
		languageOptions: {
			ecmaVersion: 2020,
			sourceType: "module",
		},
		rules: {
			"linebreak-style": ["error", "unix"],
			"semi": ["error", "always"],
			"comma-dangle": ["error", {
				arrays: "always-multiline",
				objects: "always-multiline",
				imports: "always-multiline",
				functions: "only-multiline",
			}],
			"indent": ["error", "tab"],
			"quotes": ["warn", "double"],
			"@typescript-eslint/no-non-null-assertion": "off",
			"@typescript-eslint/ban-ts-comment": "off",
		},
	},
	{
		files: ["**/*.svelte"],
		languageOptions: {
			parser: svelteParser,
			globals: globals.browser,
			parserOptions: {
				parser: tsParser,
			},
		},
	},
];

