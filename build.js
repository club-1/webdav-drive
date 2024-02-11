#!/usr/bin/env node

import esbuild from "esbuild";
import esbuildSvelte from "esbuild-svelte";
import { sveltePreprocess } from "svelte-preprocess";
import { optimizeImports } from "carbon-preprocess-svelte";

esbuild
  .build({
    entryPoints: ["src/main.ts"],
    bundle: true,
    outdir: "./public/app",
    plugins: [
      esbuildSvelte({
        preprocess: [
          sveltePreprocess(),
          optimizeImports(),
        ],
      }),
    ],
  })
  .catch(() => process.exit(1))

