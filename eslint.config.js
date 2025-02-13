/**
 * @fileoverview ESLint configuration file
 * @author Nicholas C. Zakas
 */

//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------

import eslintConfigESLint from "eslint-config-eslint";
//-----------------------------------------------------------------------------
// Config
//-----------------------------------------------------------------------------

export default [

    {
        ignores: [
            "tests/fixtures",
            "coverage",
            "docs",
            "jsdoc",
            "dist",
        ]
    },

    ...eslintConfigESLint,
    {
        files: ["tests/**/*"],
        languageOptions: {
            globals: {
                describe: "readonly",
                xdescribe: "readonly",
                it: "readonly",
                xit: "readonly",
                beforeEach: "readonly",
                afterEach: "readonly",
                before: "readonly",
                after: "readonly"
            }
        },
        rules: {
            "no-restricted-syntax": ["error", {
                selector: "CallExpression[callee.object.name='assert'][callee.property.name='doesNotThrow']",
                message: "`assert.doesNotThrow()` should be replaced with a comment next to the code."
            }]
        }
    }
];
