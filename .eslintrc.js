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
    os: 'readonly',
    util: 'readonly',
    child_process: 'readonly',
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'simple-import-sort', 'unused-imports', 'filenames', 'unicorn'],
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',

    'prettier/prettier': ['warn', prettier],
    '@typescript-eslint/ban-ts-comment': 'warn',
    'unused-imports/no-unused-imports': 'error',
    'no-useless-escape': 'warn',
    indent: ['warn', 2, { SwitchCase: 1 }],
    'linebreak-style': ['warn', 'windows'],
    quotes: ['warn', 'single'],
    semi: ['warn', 'always'],
    'no-restricted-imports': ['warn', 'fs', 'path', 'vscode', 'os', 'util', 'child_process'],
    'simple-import-sort/imports': 'warn',
    'simple-import-sort/exports': 'warn',
    'filenames/match-regex': ['warn', '^[a-zA-Z]+$', true],
    'filenames/match-exported': ['warn', ['kebab']],
    'filenames/no-index': ['warn'],
  },

  ignorePatterns: ['*.js', 'lib'],
};
