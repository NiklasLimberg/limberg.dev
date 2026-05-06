// @ts-check

import globals from 'globals';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginSvelte from 'eslint-plugin-svelte';
import svelteConfig from './svelte.config.js';

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
            globals: { ...globals.node, ...globals.browser },
            parserOptions: {
                projectService: {
                    allowDefaultProject: ['*.js', 'remark-plugins/*.js'],
                },
                extraFileExtensions: ['.svelte'],
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    {
        files: ['**/*.svelte'],
        languageOptions: {
            parserOptions: {
                parser: tseslint.parser,
                svelteConfig,
            },
        },
        rules: {
            'svelte/indent': [
                'error', {
                    indent: 4,
                    switchCase: 2,
                    alignAttributesVertically: false,
                },
            ],
        },
    },
    {
        ignores: ['.svelte-kit/', 'build/'],
    },
);
