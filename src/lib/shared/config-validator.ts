/**
 * @fileoverview Validates configs.
 * @author Brandon Mills
 */

/* eslint class-methods-use-this: "off" */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import util from 'util';

import { ValidateFunction } from 'ajv';

import configSchema from '../../conf/config-schema.js';
import BuiltInEnvironments from '../../conf/environments.js';

import { ConfigArray } from '../config-array/index.js';

import ajvOrig from './ajv.js';
import * as ConfigOps from './config-ops.js';
import { emitDeprecationWarning } from './deprecation-warnings.js';

const ajv = ajvOrig();

const ruleValidators = new WeakMap();
const noop = Function.prototype;

//------------------------------------------------------------------------------
// Private
//------------------------------------------------------------------------------
let validateSchema: ValidateFunction | { (arg0: object): any; errors: any[] };
const severityMap = {
    error: 2,
    warn: 1,
    off: 0
};

const validated = new WeakSet();

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------
interface Rule {
    schema: any | null;
    meta: { schema: any };
    create: (...args: any[]) => any;
}

export default class ConfigValidator {
    builtInRules: Map<string, Rule>;
    constructor({ builtInRules = new Map() } = {}) {
        this.builtInRules = builtInRules;
    }

    /**
     * Gets a complete options schema for a rule.
     * @param {{create: Function, schema: (Array|null)}} rule A new-style rule object
     * @returns {Object} JSON Schema for the rule's options.
     */
    getRuleOptionsSchema(rule: Rule | null) {
        if (!rule) {
            return null;
        }

        const schema = rule.schema || (rule.meta && rule.meta.schema);

        // Given a tuple of schemas, insert warning level at the beginning
        if (Array.isArray(schema)) {
            if (schema.length) {
                return {
                    type: 'array',
                    items: schema,
                    minItems: 0,
                    maxItems: schema.length
                };
            }
            return {
                type: 'array',
                minItems: 0,
                maxItems: 0
            };
        }

        // Given a full schema, leave it alone
        return schema || null;
    }

    /**
     * Validates a rule's severity and returns the severity value. Throws an error if the severity is invalid.
     * @param {options} options The given options for the rule.
     * @returns {number|string} The rule's severity value
     */
    validateRuleSeverity(options: string[] | string) {
        const severity = Array.isArray(options) ? options[0] : options;
        const normSeverity =
            // @ts-ignore
            typeof severity === 'string' ? severityMap[severity.toLowerCase()] : severity;

        if (normSeverity === 0 || normSeverity === 1 || normSeverity === 2) {
            return normSeverity;
        }

        throw new Error(
            `\tSeverity should be one of the following: 0 = off, 1 = warn, 2 = error (you passed '${util
                .inspect(severity)
                .replace(/'/gu, '"')
                .replace(/\n/gu, '')}').\n`
        );
    }

    /**
     * Validates the non-severity options passed to a rule, based on its schema.
     * @param {{create: Function}} rule The rule to validate
     * @param {Array} localOptions The options for the rule, excluding severity
     * @returns {void}
     */
    validateRuleSchema(rule: Rule, localOptions: any) {
        if (!ruleValidators.has(rule)) {
            const schema = this.getRuleOptionsSchema(rule);

            if (schema) {
                ruleValidators.set(rule, ajv.compile(schema));
            }
        }

        const validateRule = ruleValidators.get(rule);

        if (validateRule) {
            validateRule(localOptions);
            if (validateRule.errors) {
                throw new Error(
                    validateRule.errors
                        .map(
                            (error: any) =>
                                `\tValue ${JSON.stringify(error.data)} ${error.message}.\n`
                        )
                        .join('')
                );
            }
        }
    }

    /**
     * Validates a rule's options against its schema.
     * @param {{create: Function}|null} rule The rule that the config is being validated for
     * @param {string} ruleId The rule's unique name.
     * @param {Array|number} options The given options for the rule.
     * @param {string|null} source The name of the configuration source to report in any errors. If null or undefined,
     * no source is prepended to the message.
     * @returns {void}
     */
    validateRuleOptions(
        rule: Rule,
        ruleId: string,
        options: string[] | number,
        source: string | null = null
    ) {
        try {
            // @ts-ignore
            const severity = this.validateRuleSeverity(options);

            if (severity !== 0) {
                this.validateRuleSchema(rule, Array.isArray(options) ? options.slice(1) : []);
            }
        } catch (err: any) {
            const enhancedMessage = `Configuration for rule "${ruleId}" is invalid:\n${err.message}`;

            if (typeof source === 'string') {
                throw new Error(`${source}:\n\t${enhancedMessage}`);
            } else {
                throw new Error(enhancedMessage);
            }
        }
    }

    /**
     * Validates an environment object
     * @param {Object} environment The environment config object to validate.
     * @param {string} source The name of the configuration source to report in any errors.
     * @param {function(envId:string): Object} [getAdditionalEnv] A map from strings to loaded environments.
     * @returns {void}
     */
    validateEnvironment(environment: object, source: string, getAdditionalEnv = noop) {
        // not having an environment is ok
        if (!environment) {
            return;
        }

        Object.keys(environment).forEach((id) => {
            const env = getAdditionalEnv(id) || BuiltInEnvironments.get(id) || null;

            if (!env) {
                const message = `${source}:\n\tEnvironment key "${id}" is unknown\n`;

                throw new Error(message);
            }
        });
    }

    /**
     * Validates a rules config object
     * @param {Object} rulesConfig The rules config object to validate.
     * @param {string} source The name of the configuration source to report in any errors.
     * @param {function(ruleId:string): Object} getAdditionalRule A map from strings to loaded rules
     * @returns {void}
     */
    validateRules(rulesConfig: Record<string, any>, source: string, getAdditionalRule = noop) {
        if (!rulesConfig) {
            return;
        }

        Object.keys(rulesConfig).forEach((id) => {
            const rule = getAdditionalRule(id) || this.builtInRules.get(id) || null;

            this.validateRuleOptions(rule, id, rulesConfig[id], source);
        });
    }

    /**
     * Validates a `globals` section of a config file
     * @param {Object} globalsConfig The `globals` section
     * @param {string|null} source The name of the configuration source to report in the event of an error.
     * @returns {void}
     */
    validateGlobals(globalsConfig: object, source: string | null = null) {
        if (!globalsConfig) {
            return;
        }

        Object.entries(globalsConfig).forEach(([configuredGlobal, configuredValue]) => {
            try {
                ConfigOps.normalizeConfigGlobal(configuredValue);
            } catch (err: any) {
                throw new Error(
                    `ESLint configuration of global '${configuredGlobal}' in ${source} is invalid:\n${err.message}`
                );
            }
        });
    }

    /**
     * Validate `processor` configuration.
     * @param {string|undefined} processorName The processor name.
     * @param {string} source The name of config file.
     * @param {function(id:string): Processor} getProcessor The getter of defined processors.
     * @returns {void}
     */
    validateProcessor(processorName: string | undefined, source: string, getProcessor: any) {
        if (processorName && !getProcessor(processorName)) {
            throw new Error(
                `ESLint configuration of processor in '${source}' is invalid: '${processorName}' was not found.`
            );
        }
    }

    /**
     * Formats an array of schema validation errors.
     * @param {Array} errors An array of error messages to format.
     * @returns {string} Formatted error message
     */
    formatErrors(errors: any[]) {
        return errors
            .map((error) => {
                if (error.keyword === 'additionalProperties') {
                    const formattedPropertyPath = error.dataPath.length
                        ? `${error.dataPath.slice(1)}.${error.params.additionalProperty}`
                        : error.params.additionalProperty;

                    return `Unexpected top-level property "${formattedPropertyPath}"`;
                }
                if (error.keyword === 'type') {
                    const formattedField = error.dataPath.slice(1);
                    const formattedExpectedType = Array.isArray(error.schema)
                        ? error.schema.join('/')
                        : error.schema;
                    const formattedValue = JSON.stringify(error.data);

                    return `Property "${formattedField}" is the wrong type (expected ${formattedExpectedType} but got \`${formattedValue}\`)`;
                }

                const field = error.dataPath[0] === '.' ? error.dataPath.slice(1) : error.dataPath;

                return `"${field}" ${error.message}. Value: ${JSON.stringify(error.data)}`;
            })
            .map((message) => `\t- ${message}.\n`)
            .join('');
    }

    /**
     * Validates the top level properties of the config object.
     * @param {Object} config The config object to validate.
     * @param {string} source The name of the configuration source to report in any errors.
     * @returns {void}
     */
    validateConfigSchema(config: object, source = null) {
        // @ts-ignore
        validateSchema = validateSchema || ajv.compile(configSchema);

        if (!validateSchema(config)) {
            throw new Error(
                `ESLint configuration in ${source} is invalid:\n${this.formatErrors(
                    // @ts-ignore
                    validateSchema.errors
                )}`
            );
        }

        if (Object.hasOwnProperty.call(config, 'ecmaFeatures')) {
            // @ts-ignore
            emitDeprecationWarning(source, 'ESLINT_LEGACY_ECMAFEATURES');
        }
    }

    /**
     * Validates an entire config object.
     * @param {Object} config The config object to validate.
     * @param {string} source The name of the configuration source to report in any errors.
     * @param {function(ruleId:string): Object} [getAdditionalRule] A map from strings to loaded rules.
     * @param {function(envId:string): Object} [getAdditionalEnv] A map from strings to loaded envs.
     * @returns {void}
     */
    validate(
        config: any,
        source: string,
        getAdditionalRule?: (ruleId: string) => any,
        getAdditionalEnv?: (envId: string) => any
    ) {
        // @ts-ignore
        this.validateConfigSchema(config, source);
        this.validateRules(config.rules, source, getAdditionalRule);
        this.validateEnvironment(config.env, source, getAdditionalEnv);
        this.validateGlobals(config.globals, source);

        for (const override of config.overrides || []) {
            this.validateRules(override.rules, source, getAdditionalRule);
            this.validateEnvironment(override.env, source, getAdditionalEnv);
            this.validateGlobals(config.globals, source);
        }
    }

    /**
     * Validate config array object.
     * @param {ConfigArray} configArray The config array to validate.
     * @returns {void}
     */
    validateConfigArray(configArray: ConfigArray) {
        const getPluginEnv = Map.prototype.get.bind(configArray.pluginEnvironments);
        const getPluginProcessor = Map.prototype.get.bind(configArray.pluginProcessors);
        const getPluginRule = Map.prototype.get.bind(configArray.pluginRules);

        // Validate.
        for (const element of configArray) {
            if (validated.has(element)) {
                continue;
            }
            validated.add(element);

            this.validateEnvironment(element.env, element.name, getPluginEnv);
            this.validateGlobals(element.globals, element.name);
            this.validateProcessor(element.processor, element.name, getPluginProcessor);
            this.validateRules(element.rules, element.name, getPluginRule);
        }
    }
}
