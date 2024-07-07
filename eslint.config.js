// @ts-check

import globals from 'globals';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

import svelteParser from 'svelte-eslint-parser';
import eslintPluginSvelte from 'eslint-plugin-svelte';

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    ...eslintPluginSvelte.configs['flat/recommended'],
    {
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
    },
    {
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: { ...globals.node, ...globals.browser },
            parserOptions: {
                projectService: true,
                parser: tseslint.parser,
                extraFileExtensions: ['.svelte'],
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    {
        files: ['**/*.svelte', '*.svelte'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: { ...globals.browser },
            parser: svelteParser,
            parserOptions: {
                parser: tseslint.parser,
                extraFileExtensions: ['.svelte'],
            },
        },
        rules: {
            'svelte/indent': [
                'error',  {
                    indent: 4,
                    ignoredNodes: [],
                    switchCase: 2,
                    alignAttributesVertically: false,
                },
            ],
        },
    },
    {
        ignores: [
            '.DS_Store',
            'node_modules',
            '/build',
            '/.svelte-kit',
            '/package',
            'package-lock.json',
            'yarn.lock',
            '.svelte-kit',
        ],
    },

);
