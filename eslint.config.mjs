import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import prettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
    {
        ignores: ['build', 'node_modules', 'public'],
    },
    {
        files: ['**/*.{ts,tsx,mts}'],
        extends: [js.configs.recommended, tseslint.configs.recommended, prettier],
        languageOptions: {
            ecmaVersion: 2025,
            // The app runs in browsers (Node globals for tools, below)
            globals: globals.browser,
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        },
    },
    {
        // Configuration files and the relay tests run in Node
        files: ['*.config.mts', 'test/**/*.ts'],
        languageOptions: { globals: globals.node },
    },
    {
        // The service worker
        files: ['src/sw/**/*.ts'],
        languageOptions: { globals: globals.serviceworker },
    },
);
