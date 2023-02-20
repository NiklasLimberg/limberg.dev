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
            'svelte/indent': ['error',  {
                'indent': 4,
                'ignoredNodes': [],
                'switchCase': 2,
                'alignAttributesVertically': false,
            }],
            'indent': 'off',
        },
        // Parse the `<script>` in `.svelte` as TypeScript by adding the following configuration.
        parserOptions: {
            parser: '@typescript-eslint/parser',
        },
    }],
    rules: {
        quotes: ['error', 'single', { 'avoidEscape': true }],
        'comma-dangle': ['error', 'always-multiline'],
        'semi': ['error', 'always'],
        'max-len': ['error', 125],
        'no-extra-semi': 'error',
        indent: ['error', 4],
        'no-undef': 0,
    },
};
