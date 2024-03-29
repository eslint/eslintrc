"use strict";

module.exports = {
    meta: {
        schema: []
    },

    create(context) {
        return {
            "Identifier": function(node) {
                if (node.name === "foo") {
                    context.report(node, "Identifier cannot be named 'foo'.");
                }
            }
        };
    }
};
