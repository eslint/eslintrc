/**
 * @fileoverview Tests for ConfigValidator class
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import { assert } from "chai";
import nodeAssert from "node:assert";

import ConfigValidator from "../../../lib/shared/config-validator.js";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const mockRule = {
    meta: {
        schema: [{
            enum: ["first", "second"]
        }]
    },
    create(context) {
        return {
            Program(node) {
                context.report(node, "Expected a validation error.");
            }
        };
    }
};

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

const mockInvalidSchemaTypeRule = {
    meta: {
        schema: true
    },
    create(context) {
        return {
            Program(node) {
                context.report(node, "Expected a validation error.");
            }
        };
    }
};

const mockInvalidJSONSchemaRule = {
    meta: {
        schema: {
            minItems: []
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

const mockMaxPropertiesSchema = {
    meta: {
        defaultOptions: [{
            foo: 42
        }],
        schema: [{
            type: "object",
            maxProperties: 2
        }]
    },
    create() {
        return {};
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

    describe("validateRuleOptions", () => {

        it("should throw for incorrect warning level number", () => {
            const fn = validator.validateRuleOptions.bind(validator, mockRule, "mock-rule", 3, "tests");

            assert.throws(fn, "tests:\n\tConfiguration for rule \"mock-rule\" is invalid:\n\tSeverity should be one of the following: 0 = off, 1 = warn, 2 = error (you passed '3').\n");
        });

        it("should throw for incorrect warning level string", () => {
            const fn = validator.validateRuleOptions.bind(validator, mockRule, "mock-rule", "booya", "tests");

            assert.throws(fn, "tests:\n\tConfiguration for rule \"mock-rule\" is invalid:\n\tSeverity should be one of the following: 0 = off, 1 = warn, 2 = error (you passed '\"booya\"').\n");
        });

        it("should throw for invalid-type warning level", () => {
            const fn = validator.validateRuleOptions.bind(validator, mockRule, "mock-rule", [["error"]], "tests");

            assert.throws(fn, "tests:\n\tConfiguration for rule \"mock-rule\" is invalid:\n\tSeverity should be one of the following: 0 = off, 1 = warn, 2 = error (you passed '[ \"error\" ]').\n");
        });

        it("should only check warning level for nonexistent rules", () => {
            const fn1 = validator.validateRuleOptions.bind(validator, void 0, "non-existent-rule", [3, "foobar"], "tests");

            assert.throws(fn1, "tests:\n\tConfiguration for rule \"non-existent-rule\" is invalid:\n\tSeverity should be one of the following: 0 = off, 1 = warn, 2 = error (you passed '3').\n");

            const fn2 = validator.validateRuleOptions.bind(validator, null, "non-existent-rule", [3, "foobar"], "tests");

            assert.throws(fn2, "tests:\n\tConfiguration for rule \"non-existent-rule\" is invalid:\n\tSeverity should be one of the following: 0 = off, 1 = warn, 2 = error (you passed '3').\n");
        });

        it("should throw for incorrect configuration values", () => {
            const fn = validator.validateRuleOptions.bind(validator, mockRule, "mock-rule", [2, "frist"], "tests");

            assert.throws(fn, "tests:\n\tConfiguration for rule \"mock-rule\" is invalid:\n\tValue \"frist\" must be equal to one of the allowed values.\n");
        });

        it("should throw for too many configuration values", () => {
            const fn = validator.validateRuleOptions.bind(validator, mockRule, "mock-rule", [2, "first", "second"], "tests");

            assert.throws(fn, "tests:\n\tConfiguration for rule \"mock-rule\" is invalid:\n\tValue [\"first\",\"second\"] must NOT have more than 1 items.\n");
        });

        it("should throw with error code ESLINT_INVALID_RULE_OPTIONS_SCHEMA for rule with an invalid schema type", () => {
            const fn = validator.validateRuleOptions.bind(validator, mockInvalidSchemaTypeRule, "invalid-schema-rule", [2], "tests");

            nodeAssert.throws(
                fn,
                {
                    code: "ESLINT_INVALID_RULE_OPTIONS_SCHEMA",
                    message: "tests:\n\tError while processing options validation schema of rule 'invalid-schema-rule': Rule's `meta.schema` must be an array or object"
                }
            );
        });

        it("should throw with error code ESLINT_INVALID_RULE_OPTIONS_SCHEMA for rule with an invalid JSON schema", () => {
            const fn = validator.validateRuleOptions.bind(validator, mockInvalidJSONSchemaRule, "invalid-schema-rule", [2], "tests");

            nodeAssert.throws(
                fn,
                {
                    code: "ESLINT_INVALID_RULE_OPTIONS_SCHEMA",
                    message: "tests:\n\tError while processing options validation schema of rule 'invalid-schema-rule': minItems value must be [\"number\"]"
                }
            );
        });

    });

    describe("validateRuleSchema", () => {

        it("should throw when rule options are invalid after defaults are applied", () => {
            const fn = validator.validateRuleSchema.bind(validator, mockMaxPropertiesSchema, [{ bar: 6, baz: 7 }]);

            nodeAssert.throws(
                fn,
                {
                    message: '\tValue {"foo":42,"bar":6,"baz":7} must NOT have more than 2 properties.\n'
                }
            );
        });

    });
});
