/**
 * @fileoverview Package exports for @eslint/eslintrc
 * @author Nicholas C. Zakas
 */
//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import environments from '../conf/environments.js';

import { CascadingConfigArrayFactory } from './cascading-config-array-factory.js';
import {
    ConfigDependency,
    ExtractedConfig,
    IgnorePattern,
    ConfigArray,
    getUsedExtractedConfigs,
    OverrideTester
} from './config-array/index.js';
import {
    ConfigArrayFactory,
    createContext as createConfigArrayFactoryContext
} from './config-array-factory.js';
import { FlatCompat } from './flat-compat.js';
import * as ConfigOps from './shared/config-ops.js';
import ConfigValidator from './shared/config-validator.js';
import * as naming from './shared/naming.js';
import * as ModuleResolver from './shared/relative-module-resolver.js';

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

const Legacy = {
    ConfigArray,
    createConfigArrayFactoryContext,
    CascadingConfigArrayFactory,
    ConfigArrayFactory,
    ConfigDependency,
    ExtractedConfig,
    IgnorePattern,
    OverrideTester,
    getUsedExtractedConfigs,
    environments,

    // shared
    ConfigOps,
    ConfigValidator,
    ModuleResolver,
    naming
};

export { Legacy, FlatCompat };
