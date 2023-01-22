/**
 * @fileoverview Define common types for input completion.
 * @author Toru Nagashima <https://github.com/mysticatea>
 */

/** @type {any} */
export default {};

/** @typedef {boolean | "off" | "readable" | "readonly" | "writable" | "writeable"} GlobalConf */
/** @typedef {0 | 1 | 2 | "off" | "warn" | "error"} SeverityConf */
/** @typedef {SeverityConf | [SeverityConf, ...any[]]} RuleConf */

export type GlobalConf = boolean | 'off' | 'readable' | 'readonly' | 'writable' | 'writeable';
export type SeverityString = 'off' | 'warn' | 'error';
export type SeverityNumber = 0 | 1 | 2;
export type SeverityConf = SeverityString | SeverityNumber;
export type RuleConf = SeverityConf | [SeverityConf, ...any[]];

/**
 * @typedef {Object} EcmaFeatures
 * @property {boolean} [globalReturn] Enabling `return` statements at the top-level.
 * @property {boolean} [jsx] Enabling JSX syntax.
 * @property {boolean} [impliedStrict] Enabling strict mode always.
 */

export interface EcmaFeatures {
    globalReturn?: boolean;
    jsx?: boolean;
    impliedStrict?: boolean;
}

/**
 * @typedef {Object} ParserOptions
 * @property {EcmaFeatures} [ecmaFeatures] The optional features.
 * @property {3|5|6|7|8|9|10|11|12|2015|2016|2017|2018|2019|2020|2021} [ecmaVersion] The ECMAScript version (or revision number).
 * @property {"script"|"module"} [sourceType] The source code type.
 */

export interface ParserOptions {
    ecmaFeatures?: EcmaFeatures;
    // prettier-ignore
    ecmaVersion?: 3 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021;
    sourceType?: 'script' | 'module';
}

/**
 * @typedef {Object} ConfigData
 * @property {Record<string, boolean>} [env] The environment settings.
 * @property {string | string[]} [extends] The path to other config files or the package name of shareable configs.
 * @property {Record<string, GlobalConf>} [globals] The global variable settings.
 * @property {string | string[]} [ignorePatterns] The glob patterns that ignore to lint.
 * @property {boolean} [noInlineConfig] The flag that disables directive comments.
 * @property {OverrideConfigData[]} [overrides] The override settings per kind of files.
 * @property {string} [parser] The path to a parser or the package name of a parser.
 * @property {ParserOptions} [parserOptions] The parser options.
 * @property {string[]} [plugins] The plugin specifiers.
 * @property {string} [processor] The processor specifier.
 * @property {boolean} [reportUnusedDisableDirectives] The flag to report unused `eslint-disable` comments.
 * @property {boolean} [root] The root flag.
 * @property {Record<string, RuleConf>} [rules] The rule settings.
 * @property {Object} [settings] The shared settings.
 */
export interface ConfigData {
    env?: Record<string, boolean>;
    extends?: string | string[];
    globals?: Record<string, GlobalConf>;
    ignorePatterns?: string | string[];
    noInlineConfig?: boolean;
    overrides?: OverrideConfigData[];
    parser?: string;
    parserOptions?: ParserOptions;
    plugins?: string[];
    processor?: string;
    reportUnusedDisableDirectives?: boolean;
    root?: boolean;
    rules?: Record<string, RuleConf>;
    settings?: Record<string, any>;
}

/**
 * @typedef {Object} OverrideConfigData
 * @property {Record<string, boolean>} [env] The environment settings.
 * @property {string | string[]} [excludedFiles] The glob pattarns for excluded files.
 * @property {string | string[]} [extends] The path to other config files or the package name of shareable configs.
 * @property {string | string[]} files The glob patterns for target files.
 * @property {Record<string, GlobalConf>} [globals] The global variable settings.
 * @property {boolean} [noInlineConfig] The flag that disables directive comments.
 * @property {OverrideConfigData[]} [overrides] The override settings per kind of files.
 * @property {string} [parser] The path to a parser or the package name of a parser.
 * @property {ParserOptions} [parserOptions] The parser options.
 * @property {string[]} [plugins] The plugin specifiers.
 * @property {string} [processor] The processor specifier.
 * @property {boolean} [reportUnusedDisableDirectives] The flag to report unused `eslint-disable` comments.
 * @property {Record<string, RuleConf>} [rules] The rule settings.
 * @property {Object} [settings] The shared settings.
 */

export interface OverrideConfigData {
    env?: Record<string, boolean>;
    excludedFiles?: string | string[];
    extends?: string | string[];
    files: string | string[];
    globals?: Record<string, GlobalConf>;
    noInlineConfig?: boolean;
    overrides?: OverrideConfigData[];
    parser?: string;
    parserOptions?: ParserOptions;
    plugins?: string[];
    processor?: string;
    reportUnusedDisableDirectives?: boolean;
    rules?: Record<string, RuleConf>;
    settings?: Record<string, any>;
}

/**
 * @typedef {Object} ParseResult
 * @property {Object} ast The AST.
 * @property {ScopeManager} [scopeManager] The scope manager of the AST.
 * @property {Record<string, any>} [services] The services that the parser provides.
 * @property {Record<string, string[]>} [visitorKeys] The visitor keys of the AST.
 */

interface ParseResult {
    ast: Record<string, any>;
    scopeManager: any;
    services: Record<string, any>;
    visitorKeys: Record<string, string[]>;
}

/**
 * @typedef {Object} Parser
 * @property {(text:string, options:ParserOptions) => Object} parse The definition of global variables.
 * @property {(text:string, options:ParserOptions) => ParseResult} [parseForESLint] The parser options that will be enabled under this environment.
 */

export interface Parser {
    parse: (text: string, options: ParserOptions) => ParseResult;
    parseForESLint?: (text: string, options: ParserOptions) => ParseResult;
}

/**
 * @typedef {Object} Environment
 * @property {Record<string, GlobalConf>} [globals] The definition of global variables.
 * @property {ParserOptions} [parserOptions] The parser options that will be enabled under this environment.
 */

export interface Environment {
    globals?: Record<string, GlobalConf>;
    parserOptions?: ParserOptions;
}

/**
 * @typedef {Object} LintMessage
 * @property {number} column The 1-based column number.
 * @property {number} [endColumn] The 1-based column number of the end location.
 * @property {number} [endLine] The 1-based line number of the end location.
 * @property {boolean} fatal If `true` then this is a fatal error.
 * @property {{range:[number,number], text:string}} [fix] Information for autofix.
 * @property {number} line The 1-based line number.
 * @property {string} message The error message.
 * @property {string|null} ruleId The ID of the rule which makes this message.
 * @property {0|1|2} severity The severity of this message.
 * @property {Array<{desc?: string, messageId?: string, fix: {range: [number, number], text: string}}>} [suggestions] Information for suggestions.
 */

interface Fix {
    range: [number, number];
    text: string;
}
export interface LintMessage {
    column: number;
    endColumn?: number;
    endLine?: number;
    fatal: boolean;
    fix?: Fix;
    line: number;
    message: string;
    ruleId: string | null;
    severity: 0 | 1 | 2;
    suggestions?: Array<{
        desc?: string;
        messageId?: string;
        fix: Fix;
    }>;
}

/**
 * @typedef {Object} SuggestionResult
 * @property {string} desc A short description.
 * @property {string} [messageId] Id referencing a message for the description.
 * @property {{ text: string, range: number[] }} fix fix result info
 */

export interface SuggestionResult {
    desc?: string;
    messageId?: string;
    fix?: Fix;
}

/**
 * @typedef {Object} Processor
 * @property {(text:string, filename:string) => Array<string | { text:string, filename:string }>} [preprocess] The function to extract code blocks.
 * @property {(messagesList:LintMessage[][], filename:string) => LintMessage[]} [postprocess] The function to merge messages.
 * @property {boolean} [supportsAutofix] If `true` then it means the processor supports autofix.
 */

export interface Processor {
    preprocess?: (
        text: string,
        filename: string
    ) => Array<string | { text: string; filename: string }>;
    postprocess?: (messagesList: LintMessage[], filename: string) => LintMessage[];
    supportsAutofix?: boolean;
}

/**
 * @typedef {Object} RuleMetaDocs
 * @property {string} category The category of the rule.
 * @property {string} description The description of the rule.
 * @property {boolean} recommended If `true` then the rule is included in `eslint:recommended` preset.
 * @property {string} url The URL of the rule documentation.
 */

export interface RuleMetaDocs {
    category: string;
    description: string;
    recommended: boolean;
    url: string;
}

/**
 * @typedef {Object} RuleMeta
 * @property {boolean} [deprecated] If `true` then the rule has been deprecated.
 * @property {RuleMetaDocs} docs The document information of the rule.
 * @property {"code"|"whitespace"} [fixable] The autofix type.
 * @property {Record<string,string>} [messages] The messages the rule reports.
 * @property {string[]} [replacedBy] The IDs of the alternative rules.
 * @property {Array|Object} schema The option schema of the rule.
 * @property {"problem"|"suggestion"|"layout"} type The rule type.
 */

export interface RuleMeta {
    deprecated?: boolean;
    docs: RuleMetaDocs;
    fixable?: 'code' | 'whitespace';
    messages?: Record<string, string>;
    replacedBy?: string[];
    schema: Record<string, unknown> | any[];
    type: 'problem' | 'suggestion' | 'layout';
}

/**
 * @typedef {Object} Rule
 * @property {Function} create The factory of the rule.
 * @property {RuleMeta} meta The meta data of the rule.
 */

export interface Rule {
    create: (...args: any[]) => any;
    meta: RuleMeta;
}

/**
 * @typedef {Object} Plugin
 * @property {Record<string, ConfigData>} [configs] The definition of plugin configs.
 * @property {Record<string, Environment>} [environments] The definition of plugin environments.
 * @property {Record<string, Processor>} [processors] The definition of plugin processors.
 * @property {Record<string, Function | Rule>} [rules] The definition of plugin rules.
 */

export interface Plugin {
    configs?: Record<string, ConfigData>;
    environments?: Record<string, Environment>;
    processors?: Record<string, Processor>;
    rules?: Record<string, Rule>;
}

/**
 * Information of deprecated rules.
 * @typedef {Object} DeprecatedRuleInfo
 * @property {string} ruleId The rule ID.
 * @property {string[]} replacedBy The rule IDs that replace this deprecated rule.
 */

export interface DeprecatedRuleInfo {
    ruleId: string;
    replacedBy: string[];
}
