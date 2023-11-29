/**
 * @fileoverview Tests for ConfigValidator class
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import { assert } from "chai";

import ConfigValidator from "../../../lib/shared/config-validator.js";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const mockObjectRule = {
    meta: {
        schema: {
            enum: ["first", "second"]
        }
    },
    create(context) {
        return {
            Program(node) {
                context.report(node, "Expected a validation error.");
            }
        };
    }
};

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("ConfigValidator", () => {
    let validator;

    beforeEach(() => {
        validator = new ConfigValidator();
    });

    describe("getRuleOptionsSchema", () => {

        const noOptionsSchema = {
            type: "array",
            minItems: 0,
            maxItems: 0
        };

        it("should return null for a missing rule", () => {
            assert.strictEqual(validator.getRuleOptionsSchema(void 0), null);
            assert.strictEqual(validator.getRuleOptionsSchema(null), null);
        });

        it("should not modify object schema", () => {
            assert.deepStrictEqual(validator.getRuleOptionsSchema(mockObjectRule), {
                enum: ["first", "second"]
            });
        });

        it("should return schema that doesn't accept options if rule doesn't have `meta`", () => {
            const rule = {};
            const result = validator.getRuleOptionsSchema(rule);

            assert.deepStrictEqual(result, noOptionsSchema);
        });

        it("should return schema that doesn't accept options if rule doesn't have `meta.schema`", () => {
            const rule = { meta: {} };
            const result = validator.getRuleOptionsSchema(rule);

            assert.deepStrictEqual(result, noOptionsSchema);
        });

        it("should return schema that doesn't accept options if `meta.schema` is `undefined`", () => {
            const rule = { meta: { schema: void 0 } };
            const result = validator.getRuleOptionsSchema(rule);

            assert.deepStrictEqual(result, noOptionsSchema);
        });

        it("should return schema that doesn't accept options if `meta.schema` is `[]`", () => {
            const rule = { meta: { schema: [] } };
            const result = validator.getRuleOptionsSchema(rule);

            assert.deepStrictEqual(result, noOptionsSchema);
        });

        it("should return JSON Schema definition object if `meta.schema` is in the array form", () => {
            const firstOption = { enum: ["always", "never"] };
            const rule = { meta: { schema: [firstOption] } };
            const result = validator.getRuleOptionsSchema(rule);

            assert.deepStrictEqual(
                result,
                {
                    type: "array",
                    items: [firstOption],
                    minItems: 0,
                    maxItems: 1
                }
            );
        });

        it("should return `meta.schema` as is if `meta.schema` is an object", () => {
            const schema = {
                type: "array",
                items: [{
                    enum: ["always", "never"]
                }]
            };
            const rule = { meta: { schema } };
            const result = validator.getRuleOptionsSchema(rule);

            assert.deepStrictEqual(result, schema);
        });

        it("should return `null` if `meta.schema` is `false`", () => {
            const rule = { meta: { schema: false } };
            const result = validator.getRuleOptionsSchema(rule);

            assert.strictEqual(result, null);
        });

        [null, true, 0, 1, "", "always", () => {}].forEach(schema => {
            it(`should throw an error if \`meta.schema\` is ${typeof schema} ${schema}`, () => {
                const rule = { meta: { schema } };

                assert.throws(() => {
                    validator.getRuleOptionsSchema(rule);
                }, "Rule's `meta.schema` must be an array or object");
            });
        });

        it("should ignore top-level `schema` property", () => {
            const rule = { schema: { enum: ["always", "never"] } };
            const result = validator.getRuleOptionsSchema(rule);

            assert.deepStrictEqual(result, noOptionsSchema);
        });

    });
});
