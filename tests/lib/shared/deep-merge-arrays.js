//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import assert from "node:assert";

import { deepMergeArrays } from "../../../lib/shared/deep-merge-arrays.js";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

/**
 * Turns a value into its string equivalent for a test name.
 * @param {unknown} value Value to be stringified.
 * @returns {string} String equivalent of the value.
 */
function toTestCaseName(value) {
    return typeof value === "object" ? JSON.stringify(value) : `${value}`;
}

describe("deepMerge", () => {
    for (const [first, second, result] of [
        [void 0, void 0, []],
        [[], void 0, []],
        [["abc"], void 0, ["abc"]],
        [void 0, ["abc"], ["abc"]],
        [[], ["abc"], ["abc"]],
        [[void 0], ["abc"], ["abc"]],
        [[void 0, void 0], ["abc"], ["abc", void 0]],
        [[void 0, void 0], ["abc", "def"], ["abc", "def"]],
        [[void 0, null], ["abc"], ["abc", null]],
        [[void 0, null], ["abc", "def"], ["abc", "def"]],
        [[null], ["abc"], ["abc"]],
        [[123], [void 0], [123]],
        [[123], [null], [null]],
        [[123], [{ a: 0 }], [{ a: 0 }]],
        [["abc"], [void 0], ["abc"]],
        [["abc"], [null], [null]],
        [["abc"], ["def"], ["def"]],
        [["abc"], [{ a: 0 }], [{ a: 0 }]],
        [[["abc"]], [null], [null]],
        [[["abc"]], ["def"], ["def"]],
        [[["abc"]], [{ a: 0 }], [{ a: 0 }]],
        [[{ abc: true }], ["def"], ["def"]],
        [[{ abc: true }], [["def"]], [["def"]]],
        [[null], [{ abc: true }], [{ abc: true }]],
        [[{ a: void 0 }], [{ a: 0 }], [{ a: 0 }]],
        [[{ a: null }], [{ a: 0 }], [{ a: 0 }]],
        [[{ a: null }], [{ a: { b: 0 } }], [{ a: { b: 0 } }]],
        [[{ a: 0 }], [{ a: 1 }], [{ a: 1 }]],
        [[{ a: 0 }], [{ a: null }], [{ a: null }]],
        [[{ a: 0 }], [{ a: void 0 }], [{ a: 0 }]],
        [[{ a: 0 }], ["abc"], ["abc"]],
        [[{ a: 0 }], [123], [123]],
        [[[{ a: 0 }]], [123], [123]],
        [
            [{ a: ["b"] }],
            [{ a: ["c"] }],
            [{ a: ["c"] }]
        ],
        [
            [{ a: [{ b: "c" }] }],
            [{ a: [{ d: "e" }] }],
            [{ a: [{ d: "e" }] }]
        ],
        [
            [{ a: { b: "c" }, d: true }],
            [{ a: { e: "f" } }],
            [{ a: { b: "c", e: "f" }, d: true }]
        ],
        [
            [{ a: { b: "c" } }],
            [{ a: { e: "f" }, d: true }],
            [{ a: { b: "c", e: "f" }, d: true }]
        ],
        [
            [{ a: { b: "c" } }, { d: true }],
            [{ a: { e: "f" } }, { f: 123 }],
            [{ a: { b: "c", e: "f" } }, { d: true, f: 123 }]
        ],
        [
            [{ hasOwnProperty: true }],
            [{}],
            [{ hasOwnProperty: true }]
        ],
        [
            [{ hasOwnProperty: false }],
            [{}],
            [{ hasOwnProperty: false }]
        ],
        [
            [{ hasOwnProperty: null }],
            [{}],
            [{ hasOwnProperty: null }]
        ],
        [
            [{ hasOwnProperty: void 0 }],
            [{}],
            [{ hasOwnProperty: void 0 }]
        ],
        [
            [{}],
            [{ hasOwnProperty: null }],
            [{ hasOwnProperty: null }]
        ],
        [
            [{}],
            [{ hasOwnProperty: void 0 }],
            [{ hasOwnProperty: void 0 }]
        ],
        [
            [{
                allow: [],
                ignoreDestructuring: false,
                ignoreGlobals: false,
                ignoreImports: false,
                properties: "always"
            }],
            [],
            [{
                allow: [],
                ignoreDestructuring: false,
                ignoreGlobals: false,
                ignoreImports: false,
                properties: "always"
            }]
        ]
    ]) {
        it(`${toTestCaseName(first)}, ${toTestCaseName(second)}`, () => {
            assert.deepStrictEqual(deepMergeArrays(first, second), result);
        });
    }
});
