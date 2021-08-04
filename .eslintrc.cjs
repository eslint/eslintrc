"use strict";

module.exports = {
    root: true,
    extends: [
        "eslint"
    ],
    parserOptions: {
        ecmaVersion: 2020
    },

    /*
     * it fixes eslint-plugin-jsdoc's reports: "Invalid JSDoc tag name "template" jsdoc/check-tag-names"
     * refs: https://github.com/gajus/eslint-plugin-jsdoc#check-tag-names
     */
    settings: {
        jsdoc: {
            mode: "typescript"
        }
    },

    overrides: [
        {
            files: ["tests/**/*"],
            env: { mocha: true },
            rules: {
                "no-restricted-syntax": ["error", {
                    selector: "CallExpression[callee.object.name='assert'][callee.property.name='doesNotThrow']",
                    message: "`assert.doesNotThrow()` should be replaced with a comment next to the code."
                }],

                // Overcome https://github.com/mysticatea/eslint-plugin-node/issues/250
                "node/no-unsupported-features/es-syntax": ["error", {
                    ignores: [
                        "modules",
                        "dynamicImport"
                    ]
                }]
            }
        }
    ]
};
