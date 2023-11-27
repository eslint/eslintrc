/**
 * @fileoverview Tests for FlatCompat class.
 * @author Nicholas C. Zakas
 */

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { assert } from "chai";
import { FlatCompat } from "../../lib/index.js";
import environments from "../../conf/environments.js";
import { createRequire } from "module";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

const FIXTURES_BASE_PATH = path.resolve(dirname, "../fixtures/flat-compat/");

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

describe("FlatCompat", () => {

    describe("config()", async () => {

        let compat;
        const baseDirectory = getFixturePath("config");
        const pluginFixture1 = (await import(pathToFileURL(path.join(baseDirectory, "node_modules/eslint-plugin-fixture1.js")))).default;
        const pluginFixture2 = (await import(pathToFileURL(path.join(baseDirectory, "node_modules/eslint-plugin-fixture2.js")))).default;
        const pluginFixture3 = (await import(pathToFileURL(path.join(baseDirectory, "node_modules/eslint-plugin-fixture3.js")))).default;

        beforeEach(() => {
            compat = new FlatCompat({
                baseDirectory,
                recommendedConfig: { settings: { "eslint:recommended": true } },
                allConfig: { settings: { "eslint:all": true } }
            });
        });

        describe("top-level", () => {

            describe("ignorePatterns", () => {
                it("should translate ignorePatterns string into ignores array", () => {
                    const result = compat.config({
                        ignorePatterns: "*.jsx"
                    });

                    assert.strictEqual(result.length, 1);
                    assert.typeOf(result[0].ignores[0], "function");
                    assert.isTrue(result[0].ignores[0](path.join(baseDirectory, "foo.jsx")));
                    assert.isFalse(result[0].ignores[0](path.join(baseDirectory, "foo.js")));
                });

                it("should translate ignorePatterns array into ignores array", () => {
                    const result = compat.config({
                        ignorePatterns: ["*.jsx"]
                    });

                    assert.strictEqual(result.length, 1);
                    assert.typeOf(result[0].ignores[0], "function");
                    assert.isTrue(result[0].ignores[0](path.join(baseDirectory, "foo.jsx")));
                    assert.isFalse(result[0].ignores[0](path.join(baseDirectory, "foo.js")));
                });

                it("should ignore second argument of ignore function from ignorePatterns", () => {
                    const result = compat.config({
                        ignorePatterns: ["*.jsx"]
                    });

                    assert.strictEqual(result.length, 1);
                    assert.typeOf(result[0].ignores[0], "function");
                    assert.isTrue(result[0].ignores[0](path.join(baseDirectory, "foo.jsx"), {}));
                    assert.isFalse(result[0].ignores[0](path.join(baseDirectory, "foo.js"), ""));
                });

                it("should combine ignorePatterns from extended configs", () => {
                    const result = compat.config({
                        ignorePatterns: ["!foo/bar"],
                        extends: "ignores-foo"
                    });

                    assert.strictEqual(result.length, 1);
                    assert.typeOf(result[0].ignores[0], "function");
                    assert.isTrue(result[0].ignores[0](path.join(baseDirectory, "foo/baz.js")));
                    assert.isFalse(result[0].ignores[0](path.join(baseDirectory, "foo/bar/baz.js")));
                });


            });

            it("should translate settings", () => {
                const result = compat.config({
                    settings: {
                        foo: true,
                        bar: false
                    }
                });

                assert.strictEqual(result.length, 1);
                assert.deepStrictEqual(result[0], {
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

                assert.strictEqual(result.length, 1);
                assert.deepStrictEqual(result[0], {
                    plugins: {
                        fixture1: pluginFixture1
                    }
                });
            });

            it("should translate plugins with processors", () => {
                const result = compat.config({
                    plugins: ["fixture2"]
                });

                assert.strictEqual(result.length, 2);
                assert.deepStrictEqual(result[0], {
                    files: ["**/*.md"],
                    processor: pluginFixture2.processors[".md"]
                });
                assert.deepStrictEqual(result[1], {
                    plugins: {
                        fixture2: pluginFixture2
                    }
                });
            });

            it("should translate multiple plugins", () => {
                const result = compat.config({
                    plugins: ["fixture1", "fixture2"]
                });

                assert.strictEqual(result.length, 2);
                assert.deepStrictEqual(result[0], {
                    files: ["**/*.md"],
                    processor: pluginFixture2.processors[".md"]
                });
                assert.deepStrictEqual(result[1], {
                    plugins: {
                        fixture1: pluginFixture1,
                        fixture2: pluginFixture2
                    }
                });
            });

            it("should translate plugins with environments", () => {
                const result = compat.config({
                    plugins: ["fixture3"],
                    env: {
                        "fixture3/a": true,
                        "fixture3/b": true
                    }
                });

                assert.strictEqual(result.length, 3);
                assert.deepStrictEqual(result[0], {
                    languageOptions: {
                        globals: {
                            foo: true
                        }
                    }
                });
                assert.deepStrictEqual(result[1], {
                    languageOptions: {
                        globals: {
                            bar: false
                        }
                    }
                });
                assert.deepStrictEqual(result[2], {
                    plugins: {
                        fixture3: pluginFixture3
                    }
                });
            });

            it("should translate builtin env with files", () => {
                const result = compat.config({
                    rules: {
                        foo: "error"
                    },
                    overrides: [
                        {
                            files: "*.jsx",
                            env: {
                                amd: true
                            }
                        }
                    ]
                });

                assert.strictEqual(result.length, 3);

                assert.deepStrictEqual(result[0], {
                    rules: {
                        foo: "error"
                    }
                });

                assert.deepStrictEqual(result[1].languageOptions, {
                    ...environments.get("amd")
                });
                assert.typeOf(result[1].files[0], "function");
                assert.isTrue(result[1].files[0]("/usr/eslint/foo.jsx"));
                assert.isFalse(result[1].files[0]("/usr/eslint/foo.js"));

                assert.typeOf(result[2].files[0], "function");
                assert.isTrue(result[2].files[0]("/usr/eslint/foo.jsx"));
                assert.isFalse(result[2].files[0]("/usr/eslint/foo.js"));
            });

            it("should translate plugin env with files", () => {
                const result = compat.config({
                    rules: {
                        foo: "error"
                    },
                    overrides: [
                        {
                            files: "*.jsx",
                            plugins: ["fixture3"],
                            env: {
                                "fixture3/a": true,
                                "fixture3/b": true
                            }
                        }
                    ]
                });

                assert.strictEqual(result.length, 4);

                assert.deepStrictEqual(result[0], {
                    rules: {
                        foo: "error"
                    }
                });

                assert.deepStrictEqual(result[1].languageOptions, {
                    globals: {
                        foo: true
                    }
                });
                assert.typeOf(result[1].files[0], "function");
                assert.isTrue(result[1].files[0]("/usr/eslint/foo.jsx"));
                assert.isFalse(result[1].files[0]("/usr/eslint/foo.js"));

                assert.deepStrictEqual(result[2].languageOptions, {
                    globals: {
                        bar: false
                    }
                });
                assert.typeOf(result[2].files[0], "function");
                assert.isTrue(result[2].files[0]("/usr/eslint/foo.jsx"));
                assert.isFalse(result[2].files[0]("/usr/eslint/foo.js"));

                assert.deepStrictEqual(result[3].plugins, {
                    fixture3: pluginFixture3
                });
                assert.typeOf(result[3].files[0], "function");
                assert.isTrue(result[3].files[0]("/usr/eslint/foo.jsx"));
                assert.isFalse(result[3].files[0]("/usr/eslint/foo.js"));
            });

        });

        describe("extends", () => {
            it("should translate extends string into a config object", () => {
                const result = compat.config({
                    extends: "fixture1",
                    rules: {
                        foo: "warn"
                    }
                });

                assert.strictEqual(result.length, 2);
                assert.deepStrictEqual(result[0], {
                    languageOptions: {
                        globals: {
                            foobar: true
                        }
                    }
                });
                assert.deepStrictEqual(result[1], {
                    rules: {
                        foo: "warn"
                    }
                });
            });

            it("should translate extends eslint:all into settings", () => {
                const result = compat.config({
                    extends: "eslint:all",
                    rules: {
                        foo: "warn"
                    }
                });

                assert.strictEqual(result.length, 2);
                assert.isTrue(result[0].settings["eslint:all"]);
                assert.deepStrictEqual(result[1], {
                    rules: {
                        foo: "warn"
                    }
                });
            });

            it("should translate extends [eslint:all] into settings", () => {
                const result = compat.config({
                    extends: ["eslint:all"],
                    rules: {
                        foo: "warn"
                    }
                });

                assert.strictEqual(result.length, 2);
                assert.isTrue(result[0].settings["eslint:all"]);
                assert.deepStrictEqual(result[1], {
                    rules: {
                        foo: "warn"
                    }
                });
            });

            it("should translate extends eslint:recommended into settings", () => {
                const result = compat.config({
                    extends: "eslint:recommended",
                    rules: {
                        foo: "warn"
                    }
                });

                assert.strictEqual(result.length, 2);
                assert.isTrue(result[0].settings["eslint:recommended"]);
                assert.deepStrictEqual(result[1], {
                    rules: {
                        foo: "warn"
                    }
                });
            });

            it("should translate extends [eslint:recommended] into settings", () => {
                const result = compat.config({
                    extends: ["eslint:recommended"],
                    rules: {
                        foo: "warn"
                    }
                });

                assert.strictEqual(result.length, 2);
                assert.isTrue(result[0].settings["eslint:recommended"]);
                assert.deepStrictEqual(result[1], {
                    rules: {
                        foo: "warn"
                    }
                });
            });

            it("should translate extends array into a config object", () => {
                const result = compat.config({
                    extends: ["fixture1"],
                    rules: {
                        foo: "warn"
                    }
                });

                assert.strictEqual(result.length, 2);
                assert.deepStrictEqual(result[0], {
                    languageOptions: {
                        globals: {
                            foobar: true
                        }
                    }
                });
                assert.deepStrictEqual(result[1], {
                    rules: {
                        foo: "warn"
                    }
                });
            });

            it("should translate extends array with multiple configs into config objects", () => {
                const result = compat.config({
                    extends: ["fixture1", "eslint:all", "fixture2"],
                    rules: {
                        foo: "warn"
                    }
                });

                assert.strictEqual(result.length, 4);
                assert.deepStrictEqual(result[0], {
                    languageOptions: {
                        globals: {
                            foobar: true
                        }
                    }
                });
                assert.isTrue(result[1].settings["eslint:all"]);
                assert.deepStrictEqual(result[2], {
                    languageOptions: {
                        globals: {
                            foobar: false
                        }
                    },
                    rules: {
                        foobar: "error"
                    }
                });
                assert.deepStrictEqual(result[3], {
                    rules: {
                        foo: "warn"
                    }
                });
            });

            it("should throw an error when extending eslint:all without allConfig", () => {
                const invalidCompat = new FlatCompat();

                assert.throws(() => {
                    invalidCompat.config({
                        extends: "eslint:all"
                    });
                }, /Missing parameter 'allConfig'/gu);
            });

            it("should throw an error when extending eslint:recommended without recommendedConfig", () => {
                const invalidCompat = new FlatCompat();

                assert.throws(() => {
                    invalidCompat.config({
                        extends: "eslint:recommended"
                    });
                }, /Missing parameter 'recommendedConfig'/gu);
            });

        });

        describe("overrides", () => {
            it("should translate files string into files array", () => {
                const result = compat.config({
                    rules: {
                        foo: "error"
                    },
                    overrides: [
                        {
                            files: "*.jsx",
                            rules: {
                                foo: "warn"
                            }
                        }
                    ]
                });

                assert.strictEqual(result.length, 2);
                assert.deepStrictEqual(result[0], {
                    rules: {
                        foo: "error"
                    }
                });
                assert.typeOf(result[1].files[0], "function");
                assert.isTrue(result[1].files[0]("/usr/eslint/foo.jsx"));
                assert.isFalse(result[1].files[0]("/usr/eslint/foo.js"));
                assert.deepStrictEqual(result[1].rules, {
                    foo: "warn"
                });
            });

            it("should translate files array into files array", () => {
                const result = compat.config({
                    rules: {
                        foo: "error"
                    },
                    overrides: [
                        {
                            files: ["*.jsx"],
                            rules: {
                                foo: "warn"
                            }
                        }
                    ]
                });

                assert.strictEqual(result.length, 2);
                assert.deepStrictEqual(result[0], {
                    rules: {
                        foo: "error"
                    }
                });
                assert.typeOf(result[1].files[0], "function");
                assert.isTrue(result[1].files[0]("/usr/eslint/foo.jsx"));
                assert.isFalse(result[1].files[0]("/usr/eslint/foo.js"));
                assert.deepStrictEqual(result[1].rules, {
                    foo: "warn"
                });
            });

            it("should translate files array with multiple patterns into files array", () => {
                const result = compat.config({
                    rules: {
                        foo: "error"
                    },
                    overrides: [
                        {
                            files: ["*.jsx", "*.js"],
                            rules: {
                                foo: "warn"
                            }
                        }
                    ]
                });

                assert.strictEqual(result.length, 2);
                assert.deepStrictEqual(result[0], {
                    rules: {
                        foo: "error"
                    }
                });
                assert.typeOf(result[1].files[0], "function");
                assert.isTrue(result[1].files[0]("/usr/eslint/foo.jsx"));
                assert.isTrue(result[1].files[0]("/usr/eslint/foo.js"));
                assert.isFalse(result[1].files[0]("/usr/eslint/foo.jsm"));
                assert.deepStrictEqual(result[1].rules, {
                    foo: "warn"
                });
            });

            it("should translate files/excludedFiles strings into files/ignores array", () => {
                const result = compat.config({
                    rules: {
                        foo: "error"
                    },
                    overrides: [
                        {
                            files: "*",
                            excludedFiles: "*.jsx",
                            rules: {
                                foo: "warn"
                            }
                        }
                    ]
                });

                assert.strictEqual(result.length, 2);
                assert.deepStrictEqual(result[0], {
                    rules: {
                        foo: "error"
                    }
                });
                assert.typeOf(result[1].files[0], "function");
                assert.isFalse(result[1].files[0]("/usr/eslint/foo.jsx"));
                assert.isTrue(result[1].files[0]("/usr/eslint/foo.js"));
                assert.deepStrictEqual(result[1].rules, {
                    foo: "warn"
                });
            });

            it("should translate files/excludedFiles arrays into files/ignores array", () => {
                const result = compat.config({
                    rules: {
                        foo: "error"
                    },
                    overrides: [
                        {
                            files: ["*"],
                            excludedFiles: ["*.jsx"],
                            rules: {
                                foo: "warn"
                            }
                        }
                    ]
                });

                assert.strictEqual(result.length, 2);
                assert.deepStrictEqual(result[0], {
                    rules: {
                        foo: "error"
                    }
                });
                assert.typeOf(result[1].files[0], "function");
                assert.isFalse(result[1].files[0]("/usr/eslint/foo.jsx"));
                assert.isTrue(result[1].files[0]("/usr/eslint/foo.js"));
                assert.deepStrictEqual(result[1].rules, {
                    foo: "warn"
                });
            });

            it("should translate files/excludedFiles arrays with multiple items into files/ignores array", () => {
                const result = compat.config({
                    rules: {
                        foo: "error"
                    },
                    overrides: [
                        {
                            files: ["*.js", "*.jsx"],
                            excludedFiles: ["*.test.js", "*test.jsx"],
                            rules: {
                                foo: "warn"
                            }
                        }
                    ]
                });

                assert.strictEqual(result.length, 2);
                assert.deepStrictEqual(result[0], {
                    rules: {
                        foo: "error"
                    }
                });
                assert.typeOf(result[1].files[0], "function");
                assert.isTrue(result[1].files[0]("/usr/eslint/foo.jsx"));
                assert.isTrue(result[1].files[0]("/usr/eslint/foo.js"));
                assert.isFalse(result[1].files[0]("/usr/eslint/foo.test.jsx"));
                assert.isFalse(result[1].files[0]("/usr/eslint/foo.test.js"));
                assert.deepStrictEqual(result[1].rules, {
                    foo: "warn"
                });
            });

            it("should translate multiple files/excludedFiles arrays with multiple items into files/ignores array", () => {
                const result = compat.config({
                    rules: {
                        foo: "error"
                    },
                    overrides: [
                        {
                            files: ["*.js", "*.jsx"],
                            excludedFiles: ["*.test.js", "*test.jsx"],
                            rules: {
                                foo: "warn"
                            }
                        },
                        {
                            files: ["*.md", "*.mdx"],
                            excludedFiles: ["*.test.md", "*test.mdx"],
                            rules: {
                                bar: "error"
                            }
                        }

                    ]
                });

                assert.strictEqual(result.length, 3);
                assert.deepStrictEqual(result[0], {
                    rules: {
                        foo: "error"
                    }
                });

                assert.typeOf(result[1].files[0], "function");
                assert.isTrue(result[1].files[0]("/usr/eslint/foo.jsx"));
                assert.isTrue(result[1].files[0]("/usr/eslint/foo.js"));
                assert.isFalse(result[1].files[0]("/usr/eslint/foo.test.jsx"));
                assert.isFalse(result[1].files[0]("/usr/eslint/foo.test.js"));
                assert.deepStrictEqual(result[1].rules, {
                    foo: "warn"
                });


                assert.typeOf(result[2].files[0], "function");
                assert.isTrue(result[2].files[0]("/usr/eslint/foo.mdx"));
                assert.isTrue(result[2].files[0]("/usr/eslint/foo.md"));
                assert.isFalse(result[2].files[0]("/usr/eslint/foo.test.mdx"));
                assert.isFalse(result[2].files[0]("/usr/eslint/foo.test.md"));
                assert.deepStrictEqual(result[2].rules, {
                    bar: "error"
                });
            });

        });

        describe("linterOptions", () => {

            ["noInlineConfig", "reportUnusedDisableDirectives"].forEach(propertyName => {
                it(`should translate ${propertyName} into linterOptions.${propertyName}`, () => {
                    const result = compat.config({
                        [propertyName]: true
                    });

                    assert.strictEqual(result.length, 1);
                    assert.deepStrictEqual(result[0], {
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

                assert.strictEqual(result.length, 1);
                assert.deepStrictEqual(result[0], {
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

                assert.strictEqual(result.length, 1);
                assert.deepStrictEqual(result[0], {
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

                assert.strictEqual(result.length, 1);
                assert.deepStrictEqual(result[0], {
                    languageOptions: {
                        ...environments.get("amd")
                    }
                });
            });

            it("should translate parserOptions", () => {
                const parserOptions = {
                    foo: true,
                    bar: false
                };

                const result = compat.config({
                    parserOptions
                });

                assert.strictEqual(result.length, 1);
                assert.deepStrictEqual(result[0], {
                    languageOptions: {
                        parserOptions: {
                            foo: true,
                            bar: false
                        }
                    }
                });

                // the object should be a clone, not the original
                assert.notStrictEqual(result[0].languageOptions.parserOptions, parserOptions);
            });

            it("should translate parser string into an object", async () => {
                const result = compat.config({
                    parser: "my-parser"
                });

                assert.strictEqual(result.length, 1);
                assert.deepStrictEqual(result[0], {
                    languageOptions: {
                        parser: (await import(pathToFileURL(getFixturePath("config/node_modules/my-parser.js")))).default
                    }
                });
            });

            it("should throw an error when the parser can't be found", () => {

                assert.throws(() => {
                    compat.config({
                        parser: "missing-parser"
                    });
                }, /Failed to load parser 'missing-parser'/u);
            });

            it("should translate sourceType", () => {
                const result = compat.config({
                    parserOptions: {
                        sourceType: "module"
                    }
                });

                assert.strictEqual(result.length, 1);
                assert.deepStrictEqual(result[0], {
                    languageOptions: {
                        sourceType: "module"
                    }
                });
            });

            it("should translate multiple options", () => {
                const result = compat.config({
                    parserOptions: {
                        sourceType: "module"
                    },
                    globals: {
                        foo: true,
                        bar: false
                    }
                });

                assert.strictEqual(result.length, 1);
                assert.deepStrictEqual(result[0], {
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
            compat = new FlatCompat();
        });

        it("should translate env into globals", () => {
            const result = compat.env({
                amd: true
            });

            assert.strictEqual(result.length, 1);
            assert.deepStrictEqual(result[0], {
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

            assert.strictEqual(result.length, 1);
            assert.deepStrictEqual(result[0], {
                languageOptions: {
                    ...environments.get("amd")
                }
            });
        });

        it("should translate env with parserOptions.ecmaVersion into globals and languageOptions.ecmaVersion", () => {
            const result = compat.env({
                es6: true
            });

            assert.strictEqual(result.length, 1);
            assert.deepStrictEqual(result[0], {
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

            assert.strictEqual(result.length, 1);
            assert.deepStrictEqual(result[0], {
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

            assert.strictEqual(result.length, 1);
            assert.deepStrictEqual(result[0], {
                languageOptions: {
                    ecmaVersion: 12,
                    globals: {
                        ...environments.get("es2021").globals
                    }
                }
            });
        });

    });

    describe("extends()", () => {

        let compat;

        beforeEach(() => {
            compat = new FlatCompat({
                baseDirectory: getFixturePath("config"),
                recommendedConfig: { settings: { "eslint:recommended": true } },
                allConfig: { settings: { "eslint:all": true } }
            });
        });

        it("should translate extends string into a config object", () => {
            const result = compat.extends("fixture1");

            assert.strictEqual(result.length, 1);
            assert.deepStrictEqual(result[0], {
                languageOptions: {
                    globals: {
                        foobar: true
                    }
                }
            });
        });

        it("should translate extends eslint:all into settings", () => {
            const result = compat.extends("eslint:all");

            assert.strictEqual(result.length, 1);
            assert.isTrue(result[0].settings["eslint:all"]);
        });

        it("should translate extends eslint:recommended into settings", () => {
            const result = compat.extends("eslint:recommended");

            assert.strictEqual(result.length, 1);
            assert.isTrue(result[0].settings["eslint:recommended"]);
        });

        it("should translate extends array with multiple configs into config objects", () => {
            const result = compat.extends("fixture1", "eslint:all", "fixture2");

            assert.strictEqual(result.length, 3);
            assert.deepStrictEqual(result[0], {
                languageOptions: {
                    globals: {
                        foobar: true
                    }
                }
            });
            assert.isTrue(result[1].settings["eslint:all"]);
            assert.deepStrictEqual(result[2], {
                languageOptions: {
                    globals: {
                        foobar: false
                    }
                },
                rules: {
                    foobar: "error"
                }
            });
        });

        it("should throw an error when extending eslint:all without allConfig", () => {
            const invalidCompat = new FlatCompat();

            assert.throws(() => {
                invalidCompat.extends("eslint:all");
            }, /Missing parameter 'allConfig'/gu);
        });

        it("should throw an error when extending eslint:recommended without recommendedConfig", () => {
            const invalidCompat = new FlatCompat();

            assert.throws(() => {
                invalidCompat.extends("eslint:recommended");
            }, /Missing parameter 'recommendedConfig'/gu);
        });

        it("should throw an error when extending eslint:recommended without recommendedConfig but with allConfig", () => {
            const invalidCompat = new FlatCompat({
                allConfig: {}
            });

            assert.throws(() => {
                invalidCompat.extends("eslint:recommended");
            }, /Missing parameter 'recommendedConfig'/gu);
        });

    });

    describe("plugins()", () => {

        let compat;

        beforeEach(() => {
            compat = new FlatCompat({
                baseDirectory: getFixturePath("config")
            });
        });

        it("should translate plugins without processors", async () => {
            const result = compat.plugins("fixture1");

            assert.strictEqual(result.length, 1);
            assert.deepStrictEqual(result[0], {
                plugins: {
                    fixture1: (await import(pathToFileURL(path.join(compat.baseDirectory, "node_modules/eslint-plugin-fixture1.js")))).default
                }
            });
        });

        it("should throw an error when a plugin is missing", () => {
            assert.throws(() => {
                compat.plugins("missing");
            }, /Failed to load plugin 'missing'/u);
        });

        it("should translate plugins with processors", async () => {
            const result = compat.plugins("fixture2");
            const plugin = (await import(pathToFileURL(path.join(compat.baseDirectory, "node_modules/eslint-plugin-fixture2.js")))).default;

            assert.strictEqual(result.length, 2);
            assert.deepStrictEqual(result[0], {
                files: ["**/*.md"],
                processor: plugin.processors[".md"]
            });
            assert.deepStrictEqual(result[1], {
                plugins: {
                    fixture2: plugin
                }
            });
        });

        it("should translate multiple plugins", async () => {
            const result = compat.plugins("fixture1", "fixture2");
            const plugin = (await import(pathToFileURL(path.join(compat.baseDirectory, "node_modules/eslint-plugin-fixture2.js")))).default;

            assert.strictEqual(result.length, 2);
            assert.deepStrictEqual(result[0], {
                files: ["**/*.md"],
                processor: plugin.processors[".md"]
            });
            assert.deepStrictEqual(result[1], {
                plugins: {
                    fixture1: (await import(pathToFileURL(path.join(compat.baseDirectory, "node_modules/eslint-plugin-fixture1.js")))).default,
                    fixture2: plugin
                }
            });
        });

        it("should use the same plugin instance as require()", async () => {
            const result = compat.config({ plugins: ["fixture2"] });
            const plugin = require(path.join(compat.baseDirectory, "node_modules/eslint-plugin-fixture2.js"));

            assert.strictEqual(result[1].plugins.fixture2, plugin);
        });

    });

});
