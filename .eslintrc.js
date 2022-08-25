// @ts-check
/**
 * @Author likan
 * @Date 2022/8/17 17:32:45
 * @FilePath E:\WorkSpace\likan\.eslintrc.js
 */

const prettier = require('./.prettierrc.js');

/** @typedef {import('eslint').Linter.BaseConfig} EslintConfig */
/** @typedef {import('eslint').Linter.Config} Config */

/** @type EslintConfig & Config */
module.exports = {
  root: true,
  settings: {},
  env: {
    es2021: true,
    node: true,
  },
  globals: {
    vscode: 'readonly',
    path: 'readonly',
    fs: 'readonly',
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
    '@typescript-eslint/ban-ts-comment': 'warn',
    'no-useless-escape': 'warn',
    indent: ['error', 2, { SwitchCase: 1 }],
    'linebreak-style': ['error', 'windows'],
    quotes: ['warn', 'single'],
    semi: ['error', 'always'],
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'no-restricted-imports': ['error', 'fs', 'path', 'vscode'],
    'prettier/prettier': ['error', prettier],
  },

  ignorePatterns: ['*.js'],
};
