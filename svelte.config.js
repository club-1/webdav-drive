ts = require('svelte-preprocess').typescript;
carbon = require("carbon-preprocess-svelte").optimizeCarbonImports;

module.exports = {
    preprocess: [
        // preprocess typescript in svelte files
        ts(),
        // optimize carbon components imports,
        // very important for production builds
        carbon()
    ],
};
