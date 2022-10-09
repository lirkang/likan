// @ts-check
/**
 * @Author likan
 * @Date 2022/8/17 17:32:45
 * @Filepath likan/.eslintrc.js
 */

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
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:typescript-sort-keys/recommended',
    'plugin:unicorn/recommended',
  ],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['simple-import-sort', 'sort-keys-fix'],
  rules: {
    'unicorn/no-nested-ternary': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',

    'no-unused-expressions': 'warn',
    'no-useless-escape': 'warn',
    'linebreak-style': ['warn', 'windows'],
    quotes: ['warn', 'single'],
    semi: ['warn', 'always'],
    indent: ['warn', 2, { SwitchCase: 1, flatTernaryExpressions: true }],

    'unicorn/filename-case': ['error', { cases: { pascalCase: true, kebabCase: true } }],
    'unicorn/prefer-at': 'error',
    'unicorn/prefer-string-replace-all': 'error',
    'unicorn/prefer-json-parse-buffer': 'error',
    'unicorn/no-unsafe-regex': 'error',
    'unicorn/no-unused-properties': 'error',
    'sort-keys-fix/sort-keys-fix': 'error',
    'no-restricted-imports': ['error', 'vscode'],
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
  },

  ignorePatterns: ['*.js', 'lib'],
};
