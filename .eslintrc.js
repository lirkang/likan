// @ts-check

/**
 * @Author likan
 * @Date 2022/8/17 17:32:45
 * @Filepath likan/.eslintrc.js
 */

/** @typedef {import('eslint').Linter.BaseConfig} EslintConfig */
/** @typedef {import('eslint').Linter.Config} Config */

/** @type {EslintConfig & Config} */
module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:unicorn/recommended'],
  globals: {
    vscode: 'readonly',
    Configuration: 'readonly',
    fetch: 'readonly',
  },
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [],
  root: true,
  rules: {
    'unicorn/filename-case': ['error', { cases: { kebabCase: true, pascalCase: true } }],
    '@typescript-eslint/ban-ts-comment': 'off',
    'unicorn/consistent-function-scoping': 'off',
  },
  settings: {},
  ignorePatterns: ['*.js', 'lib'],
};
