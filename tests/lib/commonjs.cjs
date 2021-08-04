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


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("commonjs", () => {
    it("is an object", () => {
        assert.strictEqual(typeof eslintrc, "object");
    });

    it("has exports", () => {
        assert.strictEqual(typeof eslintrc.FlatCompat, "function");
        assert.strictEqual(typeof eslintrc.Legacy, "object");
        assert.strictEqual(typeof eslintrc.Legacy.environments, "object");

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
            "ConfigOps",
            "ModuleResolver",
            "naming"
        ].forEach(prop => {
            assert.strictEqual(typeof eslintrc.Legacy[prop], "object");
        });
    });
});
