// @ts-check
/**
 * @Author likan
 * @Date 2022-05-27 20:45:52
 * @Filepath likan/.prettierrc.js
 */

const Plugin = require('prettier-plugin-packagejson');

/** @type {import('prettier').Config} */
module.exports = {
  arrowParens: 'avoid',
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  printWidth: 120,
  plugins: [Plugin],
};
