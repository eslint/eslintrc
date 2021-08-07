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
