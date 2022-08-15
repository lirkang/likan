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
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    indent: ['error', 2],
    'linebreak-style': ['error', 'windows'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
  },

  ignorePatterns: ['*.js'],
};

module.exports = EslintConfig;
