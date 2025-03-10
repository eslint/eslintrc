/** List of modules not included in the bundle. */
const external = [
    "node:assert",
    "node:fs",
    "node:module",
    "node:os",
    "node:path",
    "node:url",
    "node:util",
    "ajv",
    "debug",
    "globals",
    "ignore",
    "import-fresh",
    "minimatch",
    "strip-json-comments"
];

/**
 * Custom Rollup plugin for `import.meta.url` transformation to commonjs.
 * The default transformation ('file:' + __filename) does not check characters in __filename,
 * and thus can produce invalid URLs, like in https://github.com/eslint/eslint/issues/15766
 * See https://github.com/eslint/eslint/issues/15766#issuecomment-1093941321
 * @returns {Object} Rollup plugin object.
 */
function importMetaURLPlugin() {
    return {
        name: "custom-import-meta-url",
        resolveImportMeta(property) {
            if (property === "url") {
                return "require('url').pathToFileURL(__filename).toString()";
            }
            return null;
        }
    };
}

export default [
    {
        input: "./lib/index.js",
        external,
        treeshake: false,
        output: {
            format: "cjs",
            file: "dist/eslintrc.cjs",
            sourcemap: true,
            freeze: false
        },
        plugins: [importMetaURLPlugin()]
    },
    {
        input: "./lib/index-universal.js",
        external,
        treeshake: false,
        output: {
            format: "cjs",
            file: "dist/eslintrc-universal.cjs",
            sourcemap: true,
            freeze: false
        }
    }
];
