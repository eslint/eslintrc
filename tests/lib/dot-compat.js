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

const FIXTURES_BASE_PATH = path.resolve(__dirname, "../fixtures/dot-compat/");

/**
 * Returns the full directory path for a fixture directory.
 * @param {string} dirName The directory name to resolve.
 * @returns {string} The full directory path to the fixture.
 */
function getFixturePath(dirName) {
    return path.join(FIXTURES_BASE_PATH, dirName);
}

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------

describe("DotCompat", () => {

    describe("config()", () => {

        let compat;

        beforeEach(() => {
            compat = new DotCompat({
                baseDirectory: getFixturePath("config")
            });
        })

        describe("top-level", () => {

            it("should translate ignorePatterns string into ignores array", () => {
                const result = compat.config({
                    ignorePatterns: "*.jsx"
                });

                assert.equal(result.length, 2);
                assert.deepEqual(result[0], {
                    ignores: ["*.jsx"]
                });
            });

            it("should translate ignorePatterns array into ignores array", () => {
                const result = compat.config({
                    ignorePatterns: ["*.jsx"]
                });

                assert.equal(result.length, 2);
                assert.deepEqual(result[0], {
                    ignores: ["*.jsx"]
                });
            });

            it("should translate files string into files array", () => {
                const result = compat.config({
                    files: "*.jsx"
                });

                assert.equal(result.length, 1);
                assert.deepEqual(result[0], {
                    files: ["*.jsx"]
                });
            });

            it("should translate files array into files array", () => {
                const result = compat.config({
                    files: ["*.jsx"]
                });

                assert.equal(result.length, 1);
                assert.deepEqual(result[0], {
                    files: ["*.jsx"]
                });
            });
            
            it("should translate excludedFiles string without files into files array", () => {
                const result = compat.config({
                    excludedFiles: "*.jsx"
                });

                assert.equal(result.length, 1);
                assert.deepEqual(result[0], {
                    files: [["!*.jsx"]]
                });
            });

            it("should translate excludedFiles array without files into files array", () => {
                const result = compat.config({
                    excludedFiles: ["*.jsx"]
                });

                assert.equal(result.length, 1);
                assert.deepEqual(result[0], {
                    files: [["!*.jsx"]]
                });
            });

            it("should translate excludedFiles string with files into files and ignores array", () => {
                const result = compat.config({
                    files: ["**/*.js"],
                    excludedFiles: "*.jsx"
                });

                assert.equal(result.length, 1);
                assert.deepEqual(result[0], {
                    files: ["**/*.js"],
                    ignores: ["*.jsx"]
                });
            });

            it("should translate excludedFiles array with files into files and ignores array", () => {
                const result = compat.config({
                    files: ["**/*.js"],
                    excludedFiles: ["*.jsx"]
                });

                assert.equal(result.length, 1);
                assert.deepEqual(result[0], {
                    files: ["**/*.js"],
                    ignores: ["*.jsx"]
                });
            });

            it("should translate settings", () => {
                const result = compat.config({
                    settings: {
                        foo: true,
                        bar: false
                    }
                });

                assert.equal(result.length, 1);
                assert.deepEqual(result[0], {
                    settings: {
                        foo: true,
                        bar: false
                    }
                });
            });

            it("should translate plugins without processors", () => {
                const result = compat.config({
                    plugins: ["fixture1"]
                });

                assert.equal(result.length, 1);
                assert.deepEqual(result[0], {
                    plugins: {
                        fixture1: require(path.join(compat.baseDirectory, "node_modules/eslint-plugin-fixture1"))
                    }
                });
            });

            it("should translate plugins with processors", () => {
                const result = compat.config({
                    plugins: ["fixture2"]
                });

                const plugin = require(path.join(compat.baseDirectory, "node_modules/eslint-plugin-fixture2"));

                assert.equal(result.length, 2);
                assert.deepEqual(result[0], {
                    files: ["**/*.md"],
                    processor: plugin.processors[".md"]
                });
                assert.deepEqual(result[1], {
                    plugins: {
                        fixture2: plugin
                    }
                });
            });

            it("should translate multiple plugins", () => {
                const result = compat.config({
                    plugins: ["fixture1", "fixture2"]
                });

                const plugin = require(path.join(compat.baseDirectory, "node_modules/eslint-plugin-fixture2"));

                assert.equal(result.length, 2);
                assert.deepEqual(result[0], {
                    files: ["**/*.md"],
                    processor: plugin.processors[".md"]
                });
                assert.deepEqual(result[1], {
                    plugins: {
                        fixture1: require(path.join(compat.baseDirectory, "node_modules/eslint-plugin-fixture1")),
                        fixture2: plugin
                    }
                });
            });

            it("should translate plugins with environments", () => {
                const result = compat.config({
                    plugins: ["fixture3"],
                    env: {
                        "fixture3/a": true,
                        "fixture3/b": true,
                    }
                });

                const plugin = require(path.join(compat.baseDirectory, "node_modules/eslint-plugin-fixture3"));

                assert.equal(result.length, 3);
                assert.deepEqual(result[0], {
                    plugins: {
                        fixture3: plugin
                    }
                });
                assert.deepEqual(result[1], {
                    languageOptions: {
                        globals: {
                            foo: true
                        }
                    }
                });
                assert.deepEqual(result[2], {
                    languageOptions: {
                        globals: {
                            bar: false
                        }
                    }
                });
            });

        });

        describe("linterOptions", () => {

            ["noInlineConfig", "reportUnusedDisableDirectives"].forEach(propertyName =>{
                it(`should translate ${propertyName} into linterOptions.${propertyName}`, () => {
                    const result = compat.config({
                        [propertyName]: true
                    });

                    assert.equal(result.length, 1);
                    assert.deepEqual(result[0], {
                        linterOptions: {
                            [propertyName]: true
                        }
                    });
                });
            });


            it("should translate multiple linteroptions", () => {
                const result = compat.config({
                    noInlineConfig: true,
                    reportUnusedDisableDirectives: false
                });

                assert.equal(result.length, 1);
                assert.deepEqual(result[0], {
                    linterOptions: {
                        noInlineConfig: true,
                        reportUnusedDisableDirectives: false
                    }
                });
            });

        });

        describe("languageOptions", () => {

            it("should translate globals", () => {
                const result = compat.config({
                    globals: {
                        foo: true,
                        bar: false
                    }
                });

                assert.equal(result.length, 1);
                assert.deepEqual(result[0], {
                    languageOptions: {
                        globals: {
                            foo: true,
                            bar: false
                        }
                    }
                });
            });

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

            it("should translate parserOptions", () => {
                const result = compat.config({
                    parserOptions: {
                        foo: true,
                        bar: false
                    }
                });

                assert.equal(result.length, 1);
                assert.deepEqual(result[0], {
                    languageOptions: {
                        parserOptions: {
                            foo: true,
                            bar: false
                        }
                    }
                });
            });

            it("should translate parser string into an object", () => {
                const result = compat.config({
                    parser: "my-parser"
                });

                assert.equal(result.length, 1);
                assert.deepEqual(result[0], {
                    languageOptions: {
                        parser: require(getFixturePath("config/node_modules/my-parser"))
                    }
                });
            });

            it("should translate sourceType", () => {
                const result = compat.config({
                    sourceType: "module"
                });

                assert.equal(result.length, 1);
                assert.deepEqual(result[0], {
                    languageOptions: {
                        sourceType: "module"
                    }
                });
            });

            it("should translate multiple options", () => {
                const result = compat.config({
                    sourceType: "module",
                    globals: {
                        foo: true,
                        bar: false
                    }
                });

                assert.equal(result.length, 1);
                assert.deepEqual(result[0], {
                    languageOptions: {
                        sourceType: "module",
                        globals: {
                            foo: true,
                            bar: false
                        }
                    }
                });
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

        it("should not translate env into globals when env is false", () => {
            const result = compat.env({
                amd: true,
                node: false
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

    describe("plugins()", () => {

        let compat;

        beforeEach(() => {
            compat = new DotCompat({
                baseDirectory: getFixturePath("config")
            });
        })

        it("should translate plugins without processors", () => {
            const result = compat.plugins("fixture1");

            assert.equal(result.length, 1);
            assert.deepEqual(result[0], {
                plugins: {
                    fixture1: require(path.join(compat.baseDirectory, "node_modules/eslint-plugin-fixture1"))
                }
            });
        });

        it("should translate plugins with processors", () => {
            const result = compat.plugins("fixture2");
            const plugin = require(path.join(compat.baseDirectory, "node_modules/eslint-plugin-fixture2"));

            assert.equal(result.length, 2);
            assert.deepEqual(result[0], {
                files: ["**/*.md"],
                processor: plugin.processors[".md"]
            });
            assert.deepEqual(result[1], {
                plugins: {
                    fixture2: plugin
                }
            });
        });

        it("should translate multiple plugins", () => {
            const result = compat.plugins("fixture1", "fixture2");
            const plugin = require(path.join(compat.baseDirectory, "node_modules/eslint-plugin-fixture2"));

            assert.equal(result.length, 2);
            assert.deepEqual(result[0], {
                files: ["**/*.md"],
                processor: plugin.processors[".md"]
            });
            assert.deepEqual(result[1], {
                plugins: {
                    fixture1: require(path.join(compat.baseDirectory, "node_modules/eslint-plugin-fixture1")),
                    fixture2: plugin
                }
            });
        });

    });

});
