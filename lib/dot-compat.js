/**
 * @fileoverview Compatibility class for dot config.
 * @author Nicholas C. Zakas
 */

"use strict";

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const environments = require("../conf/environments");
const createDebug = require("debug");

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

const debug = createDebug("eslintrc:dot-compat");

/**
 * Translates an ESLintRC property that can be an array or a string into an
 * array on a dot-config.
 * @param {options} options The options to work on.
 * @param {Object} options.eslintrcConfig The ESLintRC config to work on.
 * @param {Object} options.dotConfig The dot config to work on.
 * @param {string} options.fromProperty The property to read on the ESLintRC
 *      config;
 * @param {string} options.toProperty The property to write to on the dot config.
 * @returns {Object} The dot config.
 */
function translateStringOrStringArray({
    eslintrcConfig,
    dotConfig = {},
    fromProperty,
    toProperty = fromProperty
}) {

    debug(`Translating ${fromProperty} to ${toProperty}`);

    if (Array.isArray(eslintrcConfig[fromProperty])) {
        dotConfig[toProperty] = eslintrcConfig[fromProperty];
    } else {
        dotConfig[toProperty] = [eslintrcConfig[fromProperty]];
    }

    return dotConfig;
}

/**
 * Translates an ESLintRC-style config object into a dot-config-style config
 * object.
 * @param {Object} eslintrcConfig An ESLintRC-style config object.
 * @returns {Object} A dot-config-style config object. 
 */
function translateESLintRC(eslintrcConfig) {

    const dotConfig = {};
    const configs = [dotConfig];
    const languageOptions = {};
    const keysToCopy = ["settings", "rules", "processor"];
    const languageOptionsKeysToCopy = ["globals", "parser", "parserOptions", "sourceType"];

    // copy over simple translations
    for (const key of keysToCopy) {
        if (key in eslintrcConfig) {
            dotConfig[key] = eslintrcConfig[key];
        }
    }

    // copy over languageOptions
    for (const key of languageOptionsKeysToCopy) {
        if (key in eslintrcConfig) {
            dotConfig.languageOptions = languageOptions;

            if (languageOptions[key] && typeof languageOptions[key] === "object") {
                languageOptions[key] = {
                    ...eslintrcConfig[key]
                };
            } else {
                languageOptions[key] = eslintrcConfig[key];
            }
        }
    }

    // move ecmaVersion a level up
    if (languageOptions.parserOptions && "ecmaVersion" in languageOptions.parserOptions) {
        languageOptions.ecmaVersion = languageOptions.parserOptions.ecmaVersion;
        delete languageOptions.parserOptions.ecmaVersion;

        // check to see if we even need parserOptions anymore and remove it if not
        if (Object.keys(languageOptions.parserOptions).length === 0) {
            delete languageOptions.parserOptions;
        }
    }

    // translate env
    if (eslintrcConfig.env) {
        for (const envName of Object.keys(eslintrcConfig.env)) {

            // only add environments that are true
            if (environments.has(envName)) {
                debug(`Translating environment: ${envName}`);
                configs.unshift(...translateESLintRC(environments.get(envName)));
            }
        }
    }

    if (eslintrcConfig.ignorePatterns) {

        const ignorePatternsConfig = translateStringOrStringArray({
            eslintrcConfig,
            fromProperty: "ignorePatterns",
            toProperty: "ignores"
        });

        configs.unshift(ignorePatternsConfig);
    }

    if (eslintrcConfig.files) {
        translateStringOrStringArray({
            eslintrcConfig,
            dotConfig,
            fromProperty: "files"
        });
    }

    if (eslintrcConfig.excludedFiles) {
        translateStringOrStringArray({
            eslintrcConfig,
            dotConfig,
            fromProperty: "excludedFiles",
            toProperty: "ignores"
        });
    }

    // translate plugins
    // if (eslintrcConfig.plugins) {
    //     debug(`Translating plugins: ${eslintrcConfig.plugins}`);
    //     const ruleNamespaces = {};

    //     dotConfig.defs = {
    //         ruleNamespaces
    //     };

    //     for (const pluginName of eslintrcConfig.plugins) {

    //         debug(`Translating plugin: ${pluginName}`);

    //         // assign rules from plugin
    //         const plugin = configContext.plugins.get(pluginName);

    //         ruleNamespaces[pluginName] = plugin.rules;

    //         // create a config for any processors
    //         if (plugin.processors) {
    //             for (const processorName of Object.keys(plugin.processors)) {
    //                 if (processorName.startsWith(".")) {
    //                     debug(`Assigning processor: ${pluginName}/${processorName}`);

    //                     configs.unshift({
    //                         files: [`**/*${processorName}`],
    //                         processor: plugin.processors[processorName]
    //                     });
    //                 }

    //             }
    //         }
    //     }
    // }

    return configs;
}



//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

/**
 * A compatibility class for working with configs.
 */
class DotCompat {

    constructor({
        baseDirectory = process.cwd(),
        resolvePluginsRelativeTo = baseDirectory
    } = {}) {
        this.baseDirectory = baseDirectory;
        this.resolvePluginsRelativeTo = resolvePluginsRelativeTo;
    }

    config(eslintrcConfig) {
        return translateESLintRC(eslintrcConfig);
    }

    env(envConfig) {
        return translateESLintRC({
            env: envConfig
        });
    }
}

exports.DotCompat = DotCompat;
