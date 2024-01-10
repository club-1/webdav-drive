import sveltePreprocess from 'svelte-preprocess';
import { optimizeCarbonImports } from "carbon-preprocess-svelte";


export const preprocess = [
	// preprocess typescript in svelte files
	sveltePreprocess.typescript(),
	// optimize carbon components imports,
	// very important for production builds
	// and for build speeds.
	optimizeCarbonImports(),
];

const config = {
	preprocess,
}

export default config;
