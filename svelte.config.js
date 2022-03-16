ts = require('svelte-preprocess').typescript;
carbon = require("carbon-components-svelte/preprocess").optimizeCarbonImports;

module.exports = {
    preprocess: [
        // preprocess typescript in svelte files
        ts(),
        // optimize carbon components imports,
        // very important for production builds
        carbon()
    ],
};
