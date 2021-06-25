/**
 * @fileoverview The instance of Ajv validator.
 * @author Evgeny Poberezkin
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import Ajv from "ajv";

import { createRequire } from "module";
const require = createRequire(import.meta.url);

const metaSchema = require("ajv/lib/refs/json-schema-draft-04.json");

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

export default (additionalOptions = {}) => {
    const ajv = new Ajv({
        meta: false,
        useDefaults: true,
        validateSchema: false,
        missingRefs: "ignore",
        verbose: true,
        schemaId: "auto",
        ...additionalOptions
    });

    ajv.addMetaSchema(metaSchema);
    // eslint-disable-next-line no-underscore-dangle
    ajv._opts.defaultMeta = metaSchema.id;

    return ajv;
};
