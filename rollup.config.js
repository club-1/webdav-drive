import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import { typescript as ts } from 'svelte-preprocess';
import { optimizeCarbonImports as carbon } from "carbon-components-svelte/preprocess";
import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-css-only';
import { copy } from "@web/rollup-plugin-copy";
import * as path from "path";

const production = process.env.BUILD == 'production';
const srcdir = path.join(__dirname, 'src');

export default {
	input: [
		'src/main.ts',
		'src/module/BaseModule.ts',
		'src/module/PosixModule.ts',
	],
	output: {
		sourcemap: true,
		format: 'es',
		name: 'app',
		dir: 'public/app/',
		entryFileNames: (chunkInfo) =>
			path.join(path.dirname(path.relative(srcdir, chunkInfo.facadeModuleId)), '[name].js'),
		chunkFileNames: '[name].js',
	},
	plugins: [
		svelte({
			preprocess: [
				// preprocess typescript in svelte files
				ts(),
				// optimize carbon components imports,
				// very important for production builds
				carbon()
			],
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production
			}
		}),
		// we'll extract any component CSS out into
		// a separate file - better for performance
		css({ output: 'bundle.css' }),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),
		typescript({
			inlineSources: !production
		}),
		copy({patterns: 'config.json'}),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (make
		// instead of make dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};
