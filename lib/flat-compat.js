/**
 * @fileoverview Compatibility class for flat config.
 * @author Nicholas C. Zakas
 */

"use strict";

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const path = require("path");
const environments = require("../conf/environments");
const createDebug = require("debug");
const { ConfigArrayFactory } = require("./config-array-factory");
const { IgnorePattern } = require("./config-array/ignore-pattern");

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

const debug = createDebug("eslintrc:flag-compat");
const cafactory = Symbol("cafactory");

/**
 * Translates an ESLintRC-style config object into a flag-config-style config
 * object.
 * @param {Object} eslintrcConfig An ESLintRC-style config object.
 * @param {Object} options Options to help translate the config.
 * @param {string} options.resolveConfigRelativeTo To the directory to resolve
 *      configs from.
 * @param {string} options.resolvePluginsRelativeTo The directory to resolve
 *      plugins from.
 * @returns {Object} A flag-config-style config object.
 */
function translateESLintRC(eslintrcConfig, { resolveConfigRelativeTo, resolvePluginsRelativeTo }) {

    const flatConfig = {};
    const configs = [];
    const languageOptions = {};
    const linterOptions = {};
    const keysToCopy = ["settings", "rules", "processor"];
    const languageOptionsKeysToCopy = ["globals", "parser", "parserOptions"];
    const linterOptionsKeysToCopy = ["noInlineConfig", "reportUnusedDisableDirectives"];
    const pluginEnvironments = new Map();

    // check for special settings for eslint:all and eslint:recommended:
    if (eslintrcConfig.settings) {
        if (eslintrcConfig.settings["eslint:all"] === true) {
            return ["eslint:all"];
        }

        if (eslintrcConfig.settings["eslint:recommended"] === true) {
            return ["eslint:recommended"];
        }
    }

    // copy over simple translations
    for (const key of keysToCopy) {
        if (key in eslintrcConfig && typeof eslintrcConfig[key] !== "undefined") {
            flatConfig[key] = eslintrcConfig[key];
        }
    }

    // copy over languageOptions
    for (const key of languageOptionsKeysToCopy) {
        if (key in eslintrcConfig && typeof eslintrcConfig[key] !== "undefined") {
            flatConfig.languageOptions = languageOptions;

            if (languageOptions[key] && typeof languageOptions[key] === "object") {
                languageOptions[key] = {
                    ...eslintrcConfig[key]
                };
            } else {
                languageOptions[key] = eslintrcConfig[key];

                if (key === "parser") {
                    debug(`Resolving parser '${languageOptions[key]}' relative to ${resolveConfigRelativeTo}`);
                    languageOptions[key] = eslintrcConfig[key].definition;
                }
            }
        }
    }

    // copy over linterOptions
    for (const key of linterOptionsKeysToCopy) {
        if (key in eslintrcConfig && typeof eslintrcConfig[key] !== "undefined") {
            flatConfig.linterOptions = linterOptions;
            linterOptions[key] = eslintrcConfig[key];
        }
    }

    // move ecmaVersion a level up
    if (languageOptions.parserOptions) {

        if ("ecmaVersion" in languageOptions.parserOptions) {
            languageOptions.ecmaVersion = languageOptions.parserOptions.ecmaVersion;
            delete languageOptions.parserOptions.ecmaVersion;
        }

        if ("sourceType" in languageOptions.parserOptions) {
            languageOptions.sourceType = languageOptions.parserOptions.sourceType;
            delete languageOptions.parserOptions.sourceType;
        }

        // check to see if we even need parserOptions anymore and remove it if not
        if (Object.keys(languageOptions.parserOptions).length === 0) {
            delete languageOptions.parserOptions;
        }
    }

    if (eslintrcConfig.ignorePattern) {
        const ignore = IgnorePattern.createIgnore([eslintrcConfig.ignorePattern]);
        configs.unshift({

            /*
             * We need to wrap the ignore function in another function because the
             * ignore function's second parameter is a boolean `dot` that was used
             * in ESLintRC but flat config's second parameter is an options object.
             * We don't want to pass in the options object when the ignore function
             * expects a boolean so we just pass in the first argument.
             */
            ignores: [absoluteFilePath => ignore(absoluteFilePath)]
        });
    }

    // overrides
    if (eslintrcConfig.criteria) {

        for (const { includes, excludes } of eslintrcConfig.criteria.patterns) {
            if (includes) {
                flatConfig.files = includes.map(include => include.pattern);
            }

            if (excludes) {
                if (!includes) {
                    flatConfig.files = [excludes.map(exclude => `!${exclude.pattern}`)];
                } else {
                    flatConfig.ignores = excludes.map(exclude => exclude.pattern);
                }
            }

        }

    }

    // translate plugins
    if (eslintrcConfig.plugins && typeof eslintrcConfig.plugins === "object") {
        debug(`Translating plugins: ${eslintrcConfig.plugins}`);

        flatConfig.plugins = {};

        for (const pluginName of Object.keys(eslintrcConfig.plugins)) {

            debug(`Translating plugin: ${pluginName}`);
            debug(`Resolving plugin '${pluginName} relative to ${resolvePluginsRelativeTo}`);

            const plugin = eslintrcConfig.plugins[pluginName].definition;

            flatConfig.plugins[pluginName] = plugin;

            // create a config for any processors
            if (plugin.processors) {
                for (const processorName of Object.keys(plugin.processors)) {
                    if (processorName.startsWith(".")) {
                        debug(`Assigning processor: ${pluginName}/${processorName}`);

                        configs.unshift({
                            files: [`**/*${processorName}`],
                            processor: plugin.processors[processorName]
                        });
                    }

                }
            }

            // store environments
            if (plugin.environments) {
                const environmentNames = Object.keys(plugin.environments);

                environmentNames.forEach(environmentName => {
                    pluginEnvironments.set(
                        `${pluginName}/${environmentName}`,
                        plugin.environments[environmentName]
                    );
                });
            }
        }
    }

    // translate env - must come after plugins
    if (eslintrcConfig.env && typeof eslintrcConfig.env === "object") {
        for (const envName of Object.keys(eslintrcConfig.env)) {

            // only add environments that are true
            if (eslintrcConfig.env[envName]) {
                debug(`Translating environment: ${envName}`);

                if (environments.has(envName)) {

                    // built-in environments should be defined first
                    configs.unshift(...translateESLintRC(environments.get(envName), {
                        resolveConfigRelativeTo,
                        resolvePluginsRelativeTo
                    }));
                } else if (pluginEnvironments.has(envName)) {

                    // if the environment comes from a plugin, it should come after the plugin config
                    configs.push(...translateESLintRC(pluginEnvironments.get(envName), {
                        resolveConfigRelativeTo,
                        resolvePluginsRelativeTo
                    }));
                }
            }
        }
    }

    // only add if there are actually keys in the config
    if (Object.keys(flatConfig).length > 0) {
        configs.push(flatConfig);
    }

    return configs;
}


//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

/**
 * A compatibility class for working with configs.
 */
class FlatCompat {

    constructor({
        baseDirectory = process.cwd(),
        resolvePluginsRelativeTo = baseDirectory
    } = {}) {
        this.baseDirectory = baseDirectory;
        this.resolvePluginsRelativeTo = resolvePluginsRelativeTo;
        this[cafactory] = new ConfigArrayFactory({
            cwd: baseDirectory,
            resolvePluginsRelativeTo,
            eslintAllPath: path.resolve(__dirname, "../conf/eslint-all.js"),
            eslintRecommendedPath: path.resolve(__dirname, "../conf/eslint-recommended.js")
        });
    }

    /**
     * Translates an ESLintRC-style config into a flag-config-style config.
     * @param {Object} eslintrcConfig The ESLintRC-style config object.
     * @returns {Object} A flag-config-style config object.
     */
    config(eslintrcConfig) {
        const eslintrcArray = this[cafactory].create(eslintrcConfig, {
            basePath: this.baseDirectory
        });

        const flatArray = [];

        eslintrcArray.forEach(configData => {
            if (configData.type === "config") {
                flatArray.push(...translateESLintRC(configData, {
                    resolveConfigRelativeTo: path.join(this.baseDirectory, "__placeholder.js"),
                    resolvePluginsRelativeTo: path.join(this.resolvePluginsRelativeTo, "__placeholder.js")
                }));
            }
        });

        return flatArray;
    }

    /**
     * Translates the `env` section of an ESLintRC-style config.
     * @param {Object} envConfig The `env` section of an ESLintRC config.
     * @returns {Object} A flag-config object representing the environments.
     */
    env(envConfig) {
        return this.config({
            env: envConfig
        });
    }

    /**
     * Translates the `extends` section of an ESLintRC-style config.
     * @param {...string} configsToExtend The names of the configs to load.
     * @returns {Object} A flag-config object representing the config.
     */
    extends(...configsToExtend) {
        return this.config({
            extends: configsToExtend
        });
    }

    /**
     * Translates the `plugins` section of an ESLintRC-style config.
     * @param {...string} plugins The names of the plugins to load.
     * @returns {Object} A flag-config object representing the plugins.
     */
    plugins(...plugins) {
        return this.config({
            plugins
        });
    }
}

exports.FlatCompat = FlatCompat;