//@ts-check

'use strict';

const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

//@ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig **/

/** @type WebpackConfig */
const extensionConfig = {
  target: 'node',
  mode: 'development',
  plugins: [],
  optimization: {
    minimizer: [
      // @ts-ignore
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: false,
        uglifyOptions: {
          warnings: false,
          output: {
            comments: false,
            beautify: false,
          },
          compress: {
            drop_console: true,
            collapse_vars: true,
            reduce_vars: true,
          },
        },
      }),
    ],
  },

  entry: './src/index.ts',
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
      '~': path.resolve('src', '..'),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
    ],
  },
  devtool: false,
  infrastructureLogging: {
    level: 'log',
  },
};

module.exports = [extensionConfig];
