/**
 * @fileoverview `ExtractedConfig` class.
 *
 * `ExtractedConfig` class expresses a final configuration for a specific file.
 *
 * It provides one method.
 *
 * - `toCompatibleObjectAsConfigFileContent()`
 *      Convert this configuration to the compatible object as the content of
 *      config files. It converts the loaded parser and plugins to strings.
 *      `CLIEngine#getConfigForFile(filePath)` method uses this method.
 *
 * `ConfigArray#extractConfig(filePath)` creates a `ExtractedConfig` instance.
 *
 * @author Toru Nagashima <https://github.com/mysticatea>
 */

import { GlobalConf, SeverityConf } from '../shared/types.js';

import { DependentParser, DependentPlugin } from './config-dependency.js';
import { IgnorePattern } from './ignore-pattern.js';

// For VSCode intellisense
/** @typedef {import("../../shared/types").ConfigData} ConfigData */
/** @typedef {import("../../shared/types").GlobalConf} GlobalConf */
/** @typedef {import("../../shared/types").SeverityConf} SeverityConf */
/** @typedef {import("./config-dependency").DependentParser} DependentParser */
/** @typedef {import("./config-dependency").DependentPlugin} DependentPlugin */

/**
 * Check if `xs` starts with `ys`.
 * @template T
 * @param {T[]} xs The array to check.
 * @param {T[]} ys The array that may be the first part of `xs`.
 * @returns {boolean} `true` if `xs` starts with `ys`.
 */
function startsWith<T>(xs: T[], ys: T[]) {
    return xs.length >= ys.length && ys.every((y, i) => y === xs[i]);
}

/**
 * The class for extracted config data.
 */
class ExtractedConfig {
    configNameOfNoInlineConfig: string;
    env: Record<string, boolean>;
    globals: Record<string, GlobalConf>;
    ignores:
        | (((filePath: string, dot?: boolean) => boolean) & {
              basePath: string;
              patterns: string[];
          })
        | undefined;
    noInlineConfig: boolean | undefined;
    parser: DependentParser | null;
    parserOptions: Record<string, any>;
    plugins: Record<string, DependentPlugin>;
    processor: string | null;
    reportUnusedDisableDirectives: boolean | undefined;
    rules: Record<string, [SeverityConf, ...any[]]>;
    settings: Record<string, any>;
    constructor() {
        /**
         * The config name what `noInlineConfig` setting came from.
         * @type {string}
         */
        this.configNameOfNoInlineConfig = '';

        /**
         * Environments.
         * @type {Record<string, boolean>}
         */
        this.env = {};

        /**
         * Global variables.
         * @type {Record<string, GlobalConf>}
         */
        this.globals = {};

        /**
         * The glob patterns that ignore to lint.
         * @type {(((filePath:string, dot?:boolean) => boolean) & { basePath:string; patterns:string[] }) | undefined}
         */
        this.ignores = void 0;

        /**
         * The flag that disables directive comments.
         * @type {boolean|undefined}
         */
        this.noInlineConfig = void 0;

        /**
         * Parser definition.
         * @type {DependentParser|null}
         */
        this.parser = null;

        /**
         * Options for the parser.
         * @type {Object}
         */
        this.parserOptions = {};

        /**
         * Plugin definitions.
         * @type {Record<string, DependentPlugin>}
         */
        this.plugins = {};

        /**
         * Processor ID.
         * @type {string|null}
         */
        this.processor = null;

        /**
         * The flag that reports unused `eslint-disable` directive comments.
         * @type {boolean|undefined}
         */
        this.reportUnusedDisableDirectives = void 0;

        /**
         * Rule settings.
         * @type {Record<string, [SeverityConf, ...any[]]>}
         */
        this.rules = {};

        /**
         * Shared settings.
         * @type {Object}
         */
        this.settings = {};
    }

    /**
     * Convert this config to the compatible object as a config file content.
     * @returns {ConfigData} The converted object.
     */
    toCompatibleObjectAsConfigFileContent() {
        const { configNameOfNoInlineConfig, processor, ignores, ...config } = this;

        // @ts-ignore
        config.parser = config.parser && config.parser.filePath;
        // @ts-ignore
        config.plugins = Object.keys(config.plugins).filter(Boolean).reverse();
        // @ts-ignore
        config.ignorePatterns = ignores ? ignores.patterns : [];

        // Strip the default patterns from `ignorePatterns`.
        // @ts-ignore
        if (startsWith(config.ignorePatterns, IgnorePattern.DefaultPatterns)) {
            // @ts-ignore
            config.ignorePatterns = config.ignorePatterns.slice(
                IgnorePattern.DefaultPatterns.length
            );
        }

        return config;
    }
}

export { ExtractedConfig };
