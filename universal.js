// Jest (and probably other some other runtimes with custom implementations of
// `require`) doesn't support `exports` in package.json, so this file lets is
// here to help them load this module. Note that it is also `.js` and not `.cjs`
// for the same reason - Jest does not resolve `.cjs` files by default (if
// `require`d without an extension) and doesn't respect `module` outside of
// ESM mode.

module.exports = require("./dist/eslintrc-universal.cjs");
