/**
 * @fileoverview Tests for relative module resolver.
 */
"use strict";

const {
    Legacy: {
        ModuleResolver: {
            resolve
        }
    }
} = require("../../..");
const { assert } = require("chai");
const path = require("path");

describe("resolve", () => {
    assert.strictEqual(resolve("./file2.js", path.resolve("./tests/fixtures/relative-module-resolver/file.js")), path.resolve("./tests/fixtures/relative-module-resolver/file2.js"));
});
