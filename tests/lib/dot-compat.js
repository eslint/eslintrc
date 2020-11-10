/**
 * @fileoverview Tests for DotCompat class.
 * @author Toru Nagashima <https://github.com/mysticatea>
 */
"use strict";

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const os = require("os");
const path = require("path");
const fs = require("fs");
const { assert } = require("chai");
const { spy } = require("sinon");
const { createCustomTeardown } = require("../_utils");
const systemTempDir = require("temp-dir");
const { DotCompat } = require("../../lib/dot-compat");
const environments = require("../../conf/environments");

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

describe("DotCompat", () => {


    describe("config()", () => {

        let compat;

        beforeEach(() => {
            compat = new DotCompat();
        })

        it("should translate env into globals", () => {
            const result = compat.config({
                env: {
                    amd: true
                }
            });

            assert.equal(result.length, 2);
            assert.deepEqual(result[0], {
                languageOptions: {
                    ...environments.get("amd")       
                }
            });
        });

    });

    describe("env()", () => {

        let compat;

        beforeEach(() => {
            compat = new DotCompat();
        })

        it("should translate env into globals", () => {
            const result = compat.env({
                amd: true
            });

            assert.equal(result.length, 2);
            assert.deepEqual(result[0], {
                languageOptions: {
                    ...environments.get("amd")       
                }
            });
        });

        it("should translate env with parserOptions.ecmaVersion into globals and languageOptions.ecmaVersion", () => {
            const result = compat.env({
                es6: true
            });

            assert.equal(result.length, 2);
            assert.deepEqual(result[0], {
                languageOptions: {
                    ecmaVersion: 6,
                    globals: {
                        ...environments.get("es6").globals
                    }
                }
            });
        });

        it("should translate env with parserOptions.ecmaFeatures.globalReturn into globals and languageOptions.parserOptions", () => {
            const result = compat.env({
                node: true
            });

            assert.equal(result.length, 2);
            assert.deepEqual(result[0], {
                languageOptions: {
                    parserOptions: environments.get("node").parserOptions,
                    globals: {
                        ...environments.get("node").globals
                    }
                }
            });
        });

        it("should translate env with parserOptions.ecmaFeatures.globalReturn into globals and languageOptions.parserOptions", () => {
            const result = compat.env({
                es2021: true
            });

            assert.equal(result.length, 2);
            assert.deepEqual(result[0], {
                languageOptions: {
                    ecmaVersion: 12,
                    globals: {
                        ...environments.get("es2021").globals
                    }
                }
            });
        });

    });

});
