export default [
    {
        input: "./lib/index.js",
        external: [
            "module", "util", "os", "path", "debug", "fs", "import-fresh",
            "strip-json-comments", "assert", "ignore", "minimatch", "url", "ajv",
            "globals"
        ],
        treeshake: false,
        output: {
            format: "cjs",
            file: "dist/eslintrc.cjs",
            sourcemap: true
        }
    },
    {
        input: "./lib/index-universal.js",
        external: [
            "module", "util", "os", "path", "debug", "fs", "import-fresh",
            "strip-json-comments", "assert", "ignore", "minimatch", "url", "ajv",
            "globals"
        ],
        treeshake: false,
        output: {
            format: "cjs",
            file: "dist/eslintrc-universal.cjs",
            sourcemap: true
        }
    }
];
