module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2020,
        extraFileExtensions: ['.svelte'],
    },
    env: {
        browser: true,
        es2017: true,
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:svelte/recommended',
    ],
    overrides: [{
        files: ['*.svelte'],
        parser: 'svelte-eslint-parser',
        rules: {
            'svelte/indent': [
                'error',  {
                    indent: 4,
                    ignoredNodes: [],
                    switchCase: 2,
                    alignAttributesVertically: false,
                },
            ],
            indent: 'off',
        },
        // Parse the `<script>` in `.svelte` as TypeScript by adding the following configuration.
        parserOptions: {
            parser: '@typescript-eslint/parser',
        },
    }],
    rules: {
        'array-bracket-newline': ['error', 'consistent'],
        'array-bracket-spacing': ['error', 'never'],
        'arrow-spacing': ['error'],
        'block-spacing': ['error'],
        'brace-style': ['error'],
        'comma-dangle': ['error', 'always-multiline'],
        'comma-spacing': ['error'],
        'func-call-spacing': ['error'],
        indent: ['error', 4],
        'max-len': ['error', 125],
        'no-extra-semi': 'error',
        'no-multiple-empty-lines': ['error'],
        'no-trailing-spaces': ['error'],
        'no-undef': 0,
        quotes: ['error', 'single', { avoidEscape: true }],
        'quote-props': ['error', 'as-needed'],
        semi: ['error', 'always'],
        'space-before-blocks': ['error'],
        'space-in-parens': ['error'],
        'space-infix-ops': ['error'],
        'space-unary-ops': ['error'],
        'spaced-comment': ['error'],
        'switch-colon-spacing': ['error'],
        'template-tag-spacing': ['error'],
    },
};
