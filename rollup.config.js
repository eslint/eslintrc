export default {
    input: "./lib/index.js",
    external: ["fs"],
    output: {
        exports: "default",
        format: "cjs",
        file: "dist/eslintrc.cjs"
    }
};
