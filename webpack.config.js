//@ts-check

'use strict';

const path = require('path');

const IS_PROD = process.env.NODE_ENV === 'production';

//@ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig **/

/** @type WebpackConfig */
const extensionConfig = {
  target: 'node',
  mode: process.env.NODE_ENV,
  cache: true,
  devtool: IS_PROD ? false : 'eval-source-map',
  performance: { hints: 'error' },
  entry: './src/index.ts',

  optimization: {
    minimize: IS_PROD,
  },
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'index.js',
    libraryTarget: 'commonjs2',
  },
  externals: {
    vscode: 'commonjs vscode',
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': path.resolve('src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: ['ts-loader'],
      },
    ],
  },
  infrastructureLogging: {
    level: 'log',
  },
};

module.exports = extensionConfig;
