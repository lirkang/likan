/**
 * @Author likan
 * @Date 2022/8/17 17:33:19
 * @FilePath E:\WorkSpace\likan\webpack.config.js
 */

// @ts-check

'use strict';

const { resolve } = require('path');
const { ProvidePlugin, CleanPlugin } = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const IS_PROD = process.env.NODE_ENV !== 'development';

/** @typedef {import('webpack').Configuration} WebpackConfig */

/** @type WebpackConfig */
const extensionConfig = {
  cache: true,
  target: 'node',
  mode: IS_PROD ? 'production' : 'development',
  devtool: IS_PROD ? false : 'eval-source-map',
  performance: { hints: 'error' },
  entry: './src/index.ts',

  plugins: [
    // @ts-ignore
    new BundleAnalyzerPlugin({ analyzerMode: process.env.NODE_ENV === 'test' ? 'server' : 'disabled' }),
    new ProvidePlugin({ vscode: 'vscode', fs: 'fs', path: 'path' }),
    new CleanPlugin(),
  ],

  optimization: {
    minimize: IS_PROD,
  },
  output: {
    path: resolve(__dirname, 'lib'),
    filename: 'index.js',
    libraryTarget: 'commonjs2',
  },
  externals: {
    vscode: 'commonjs vscode',
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': resolve(__dirname, 'src'),
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
