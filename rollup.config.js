import { nodeResolve } from '@rollup/plugin-node-resolve';

/**
 * Custom Rollup plugin for `import.meta.url` transformation to commonjs.
 * The default transformation ('file:' + __filename) does not check characters in __filename,
 * and thus can produce invalid URLs, like in https://github.com/eslint/eslint/issues/15766
 * See https://github.com/eslint/eslint/issues/15766#issuecomment-1093941321
 * @returns {Object} Rollup plugin object.
 */
function importMetaURLPlugin() {
    return {
        name: 'custom-import-meta-url',
        resolveImportMeta(property) {
            if (property === 'url') {
                return "require('url').pathToFileURL(__filename).toString()";
            }
            return null;
        }
    };
}

export default [
    {
        input: './dist/lib/index.js',
        external: [
            'module',
            'util',
            'os',
            'path',
            'debug',
            'fs',
            'import-fresh',
            'strip-json-comments',
            'assert',
            'ignore',
            'minimatch',
            'url',
            'ajv',
            'globals'
        ],
        treeshake: false,
        output: {
            format: 'cjs',
            file: 'out/eslintrc.cjs',
            sourcemap: true,
            freeze: false
        },
        plugins: [importMetaURLPlugin(), nodeResolve()]
    },
    {
        input: './dist/lib/index-universal.js',
        external: [
            'module',
            'util',
            'os',
            'path',
            'debug',
            'fs',
            'import-fresh',
            'strip-json-comments',
            'assert',
            'ignore',
            'minimatch',
            'url',
            'ajv',
            'globals'
        ],
        treeshake: false,
        output: {
            format: 'cjs',
            file: 'out/eslintrc-universal.cjs',
            sourcemap: true,
            freeze: false
        }
    }
];
