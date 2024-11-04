import globals from 'globals';
import eslint from '@eslint/js';
import tsEslint from 'typescript-eslint';
import jest from 'eslint-plugin-jest';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
    { files: ['src/**/*.{js,mjs,cjs,ts}', 'tests/**/*.{js,mjs,cjs,ts}'] },
    { languageOptions: { globals: globals.node } },
    eslint.configs.recommended,
    ...tsEslint.configs.recommended,
    {
        files: ['src/__tests__/**/*.{js,mjs,cjs,ts}'],
        ...jest.configs['flat/recommended'],
        rules: {
            ...jest.configs['flat/recommended'].rules,
            'jest/prefer-expect-assertions': 'off',
        },
    },
    eslintPluginPrettierRecommended,
];
