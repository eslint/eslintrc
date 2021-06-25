export default {
    input: "./lib/index.js",
    external: [
        "module", "util", "os", "path", "debug", "fs", "import-fresh",
        "strip-json-comments", "assert", "ignore", "minimatch", "url", "ajv"
    ],
    treeshake: false,
    output: {
        format: "cjs",
        file: "dist/eslintrc.cjs",
        sourcemap: true
    }
};
