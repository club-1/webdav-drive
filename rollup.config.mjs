import svelte from 'rollup-plugin-svelte';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import css from 'rollup-plugin-css-only';
import { copy } from '@web/rollup-plugin-copy';
import bundleFonts from 'rollup-plugin-bundle-fonts';
import sveltePreprocess from 'svelte-preprocess';
import { optimizeCarbonImports as carbon } from "carbon-preprocess-svelte";
import { execSync } from 'child_process';
import * as path from 'path';
import { URL } from 'url';

const production = process.env.BUILD == 'production';
const srcdir = new URL('./src', import.meta.url).pathname;;

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
		// Keep directory structure of emmited files relative to src dir
		entryFileNames: (chunkInfo) =>
			path.join(path.dirname(path.relative(srcdir, chunkInfo.facadeModuleId)), '[name].js'),
		chunkFileNames: '[name].js',
	},
	plugins: [
		replace({
			values: {
				'__VERSION': () => {
					try {
						return execSync('git describe --tags').toString().slice(0, -1);
					} catch (_) {
						return 'unknown';
					}
				},
			},
			preventAssignment: true,
		}),
		svelte({
			preprocess: [
				// preprocess typescript in svelte files
				sveltePreprocess.typescript(),
				// optimize carbon components imports,
				// very important for production builds
				carbon(),
			],

			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production
			}
		}),

		// JSON plugin to convert translation files to modules.
		json({ namedExports: false }),

		// Download and package fonts localy
		bundleFonts({
			fontTargetDir: 'public/fonts',
			cssBundleDir: 'public/app',
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
		copy({ patterns: 'config.json' }),

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
