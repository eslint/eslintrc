/**
 * @fileoverview Package exports for @eslint/eslintrc
 * @author Nicholas C. Zakas
 */
//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import environments from '../conf/environments.js';

import * as ConfigOps from './shared/config-ops.js';
import ConfigValidator from './shared/config-validator.js';
import * as naming from './shared/naming.js';

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

const Legacy = {
    environments,

    // shared
    ConfigOps,
    ConfigValidator,
    naming
};

export { Legacy };
