/**
 * @fileoverview Tests for relative module resolver.
 */

import { assert } from "chai";
import path from "path";

import { Legacy } from "../../../dist/lib/index.js";

const { ModuleResolver } = Legacy;

describe("ModuleResolver", () => {
    describe("resolve()", () => {
        it("should correctly resolve a relative path", () => {
            assert.strictEqual(
                ModuleResolver.resolve(
                    "./file2.js",
                    path.resolve("./tests/fixtures/relative-module-resolver/file.js")
                ),
                path.resolve("./tests/fixtures/relative-module-resolver/file2.js")
            );
        });
    });
});
