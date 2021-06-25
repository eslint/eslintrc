export default {
    input: "./lib/index.js",
    external: ["fs"],
    output: {
        format: "cjs",
        file: "dist/eslintrc.cjs"
    }
};
