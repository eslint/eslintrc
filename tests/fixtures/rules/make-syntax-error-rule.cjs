module.exports = {
    meta: {
        schema: []
    },
    create(context) {
        return {
            Program: function(node) {
                context.report({
                    node: node,
                    message: "ERROR",
                    fix: function(fixer) {
                        return fixer.insertTextAfter(node, "this is a syntax error.");
                    }
                });
            }
        };
    }
};
