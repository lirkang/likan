//@ts-check

const prettier = require('./.prettierrc.js');

//@ts-check
/** @typedef {import('eslint').Linter.BaseConfig} EslintConfig **/
/** @typedef {import('eslint').Linter.Config} Config **/

/** @type EslintConfig & Config */
const EslintConfig = {
  env: {
    es2021: true,
    node: true,
  },
  globals: {
    vscode: 'readonly',
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'simple-import-sort'],
  rules: {
    '@typescript-eslint/no-non-null-assertion': 'off',
    indent: ['error', 2],
    'linebreak-style': ['error', 'windows'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'prettier/prettier': ['error', prettier],
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
  },

  ignorePatterns: ['*.js'],
};

module.exports = EslintConfig;
