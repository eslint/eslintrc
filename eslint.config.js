/**
 * @fileoverview ESLint configuration file
 * @author Nicholas C. Zakas
 */

//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------

import eslintConfigESLint from "eslint-config-eslint";
import eslintConfigESLintFormatting from "eslint-config-eslint/formatting";

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
            "dist"
        ]
    },

    ...eslintConfigESLint,
    eslintConfigESLintFormatting,
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
