/**
 * @fileoverview Tests for checking that the commonjs entry points are still accessible
 * @author Mike Reinstein
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("assert");
const eslintrc = require("../../dist/eslintrc.cjs");
const universal = require("../../dist/eslintrc-universal.cjs");
const path = require("path");
const sh = require("shelljs");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("eslintrc CommonJS", () => {
    it("is an object", () => {
        assert.strictEqual(typeof eslintrc, "object");
    });

    it("has exports", () => {
        assert.strictEqual(typeof eslintrc.FlatCompat, "function");
        assert.strictEqual(typeof eslintrc.Legacy, "object");

        [
            "ConfigArray",
            "createConfigArrayFactoryContext",
            "CascadingConfigArrayFactory",
            "ConfigArrayFactory",
            "ConfigDependency",
            "ExtractedConfig",
            "IgnorePattern",
            "OverrideTester",
            "getUsedExtractedConfigs",
            "ConfigValidator"
        ].forEach(prop => {
            assert.strictEqual(typeof eslintrc.Legacy[prop], "function");
        });

        // shared
        [
            "environments",
            "ConfigOps",
            "ModuleResolver",
            "naming"
        ].forEach(prop => {
            assert.strictEqual(typeof eslintrc.Legacy[prop], "object");
        });
    });
});

describe("eslintrc CommonJS Universal", () => {
    it("is an object", () => {
        assert.strictEqual(typeof universal, "object");
    });

    it("has exports", () => {
        assert.strictEqual(typeof universal.Legacy, "object");
        assert.strictEqual(typeof universal.Legacy.ConfigValidator, "function");

        // shared
        [
            "environments",
            "ConfigOps",
            "naming"
        ].forEach(prop => {
            assert.strictEqual(typeof universal.Legacy[prop], "object");
        });
    });
});

// https://github.com/eslint/eslint/issues/15766
describe("eslintrc CommonJS loading", () => {
    const testDir = path.resolve(__dirname, "../../tmp/my%2Fproject");

    before(() => {
        sh.mkdir("-p", testDir);
        sh.cp("", "./dist/eslintrc.cjs", testDir);
    });

    after(() => {
        sh.rm("-r", testDir);
    });

    it("eslintrc.cjs module successfully loads when it is in a path that contains URL-encoded characters", () => {
        require(path.resolve(testDir, "eslintrc.cjs"));
    });
});
