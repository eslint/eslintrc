// Jest (and probably other some other runtimes with custom implementations of
// `require`) doesn't support `exports` in package.json, so this file lets is
// here to help them load this module. Note that it is also `.js` and not `.cjs`
// for the same reason - `cjs` files requires to loaded with an extension, but
// since and doesn't respect `module` outside of ESM mode it still works in
// this case (and the `require` in _this_ file does specify the extension).

module.exports = require("./dist/eslintrc-universal.cjs");