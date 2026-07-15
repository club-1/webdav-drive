#!/usr/bin/env node

import esbuild from "esbuild";
import esbuildSvelte from "esbuild-svelte";
import { sveltePreprocess } from "svelte-preprocess";
import { optimizeImports } from "carbon-preprocess-svelte";
import { join } from "path";
import { readFile, writeFile } from "fs/promises";
import { existsSync, mkdirSync } from "fs";

let production = process.env.BUILD == "production";

/** @type { esbuild.BuildOptions } */
let options = {
  entryPoints: [
    "src/main.ts",
    "src/module/BaseModule.ts",
    "src/module/PosixModule.ts",
  ],
  outdir: "./public/app",
  format: "esm",
  bundle: true,
  minify: production,
  sourcemap: production ? "linked" : "inline",
  splitting: true,
  logLevel: "info",
  define: {
    "VERSION": "'" + process.env.VERSION + "'",
  },
  plugins: [
    esbuildSvelte({
      preprocess: [
        sveltePreprocess(),
        optimizeImports(),
      ],
    }),
    {
      name: 'download-fonts',
      setup(build) {
        const cache = '.cache';
        mkdirSync(cache, { recursive: true });
        build.onResolve({ filter: /^https?:\/\/.+\.(woff2?|ttf)/ }, args => {
          return {
            path: args.path,
            namespace: 'download-fonts',
          }
        });
        build.onLoad({ filter: /.*/, namespace: 'download-fonts' }, async args => {
          const key = join(cache, encodeURIComponent(args.path));
          let buf;
          if (existsSync(key)) {
            buf = readFile(key);
          } else {
            const res = await fetch(args.path);
            buf = res.arrayBuffer();
            await writeFile(key, Buffer.from(await buf));
          }
          return {
            contents: new Uint8Array(await buf),
            loader: 'file',
          }
        });
      },
    },
  ],
}

if (!process.env.MODE) {
  await esbuild.build(options)
  process.exit()
}

let ctx = await esbuild.context(options)
if (process.env.MODE == "watch" || process.env.MODE == "dev") {
  await ctx.watch()
  console.log('watching...')
}
if (process.env.MODE == "serve" || process.env.MODE == "dev") {
  await ctx.serve({
    servedir: 'public',
  })
}
